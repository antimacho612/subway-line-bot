import { createHmac } from 'node:crypto';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createApp, reply } from '../src/webhook';

const CHANNEL_SECRET = 'test-secret';

function textEvent(replyToken: string, text = '東京') {
  return {
    type: 'message',
    replyToken,
    source: { type: 'user', userId: 'U1' },
    message: { type: 'text', id: '1', text },
  };
}

function sign(body: string, secret = CHANNEL_SECRET): string {
  return createHmac('sha256', secret).update(body).digest('base64');
}

describe('reply関数', () => {
  test('テキストメッセージに返信する', async () => {
    const replyMessage = vi.fn().mockResolvedValue({});
    await reply({ replyMessage }, textEvent('token-1') as never);
    expect(replyMessage).toHaveBeenCalledTimes(1);
    expect(replyMessage.mock.calls[0][0].replyToken).toBe('token-1');
  });

  test('対象外のイベントは返信しない', async () => {
    const replyMessage = vi.fn();
    await reply({ replyMessage }, { type: 'follow', replyToken: 'token-1' } as never);
    expect(replyMessage).not.toHaveBeenCalled();
  });

  test.each([
    ['グループ', { type: 'group', groupId: 'G1', userId: 'U1' }],
    ['トークルーム', { type: 'room', roomId: 'R1', userId: 'U1' }],
  ])('%sのイベントには返信しない', async (_, source) => {
    const replyMessage = vi.fn();
    await reply({ replyMessage }, { ...textEvent('token-1'), source } as never);
    await reply({ replyMessage }, {
      type: 'postback',
      replyToken: 'token-2',
      source,
      postback: { data: 'x' },
    } as never);
    expect(replyMessage).not.toHaveBeenCalled();
  });

  test('source がないイベントには返信しない', async () => {
    const replyMessage = vi.fn();
    await reply({ replyMessage }, { ...textEvent('token-1'), source: undefined } as never);
    expect(replyMessage).not.toHaveBeenCalled();
  });
});

describe('POST /webhook', () => {
  let server: Server;
  let baseUrl: string;
  const replyMessage = vi.fn();

  beforeEach(async () => {
    replyMessage.mockReset().mockResolvedValue({});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const app = createApp({ replyMessage }, { channelSecret: CHANNEL_SECRET });
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve());
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
    vi.restoreAllMocks();
  });

  function post(body: string, signature = sign(body)) {
    return fetch(`${baseUrl}/webhook`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-line-signature': signature },
      body,
    });
  }

  test('1件失敗しても200を返す', async () => {
    replyMessage.mockRejectedValueOnce(new Error('boom'));
    const res = await post(JSON.stringify({ events: [textEvent('t1')] }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'success' });
    expect(console.error).toHaveBeenCalled();
  });

  test('Error以外の例外もログ出力して200を返す', async () => {
    replyMessage.mockRejectedValueOnce('string error');
    const res = await post(JSON.stringify({ events: [textEvent('t1')] }));
    expect(res.status).toBe(200);
    expect(console.error).toHaveBeenCalledWith(expect.any(String), 'string error');
  });

  test('一部のイベントが失敗しても全件処理される', async () => {
    replyMessage.mockImplementation(async ({ replyToken }: { replyToken: string }) => {
      if (replyToken === 't2') throw new Error('boom');
      return {};
    });
    const events = ['t1', 't2', 't3'].map((t) => textEvent(t));
    const res = await post(JSON.stringify({ events }));
    expect(res.status).toBe(200);
    expect(replyMessage).toHaveBeenCalledTimes(3);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  test('events が空でも200を返す', async () => {
    const res = await post(JSON.stringify({ events: [] }));
    expect(res.status).toBe(200);
  });

  test('不正な署名は401を返す', async () => {
    const res = await post(JSON.stringify({ events: [textEvent('t1')] }), 'invalid-signature');
    expect(res.status).toBe(401);
    expect(replyMessage).not.toHaveBeenCalled();
  });

  test('不正なJSONは400を返す', async () => {
    const res = await post('{invalid');
    expect(res.status).toBe(400);
  });
});
