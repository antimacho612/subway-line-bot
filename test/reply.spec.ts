import type { messagingApi } from '@line/bot-sdk';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { replyToOtherMessage, replyToPostbackMessage, replyToTextMessage } from '../src/reply';

const jst = (str: string) => new Date(`${str}+09:00`);

const isFlex = (m: messagingApi.Message): m is messagingApi.FlexMessage => m.type === 'flex';
const bubbleCount = (m: messagingApi.FlexMessage) => (m.contents as messagingApi.FlexCarousel).contents.length;

describe('replyToTextMessage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(jst('2024-06-10T09:30'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('駅名が1路線のみの場合は1件の時刻表を返す', () => {
    const message = replyToTextMessage('麻生');
    expect(isFlex(message)).toBe(true);
    if (isFlex(message)) {
      expect(bubbleCount(message)).toBe(1);
      expect(message.altText).toContain('麻生駅');
    }
  });

  test('複数路線の駅は路線ごとの時刻表を返す', () => {
    const message = replyToTextMessage('大通');
    expect(isFlex(message) && bubbleCount(message)).toBe(3);
  });

  test('駅が特定できない場合はテキストメッセージを返す', () => {
    const message = replyToTextMessage('存在しない駅');
    expect(message.type).toBe('text');
    expect((message as messagingApi.TextMessage).text).toContain('駅を特定できませんでした');
  });
});

describe('replyToPostbackMessage', () => {
  test('駅IDと基準日時から時刻表を返す', () => {
    const message = replyToPostbackMessage('N01', jst('2024-06-10T09:30'));
    expect(isFlex(message)).toBe(true);
    if (isFlex(message)) {
      expect(bubbleCount(message)).toBe(1);
      expect(message.altText).toContain('麻生駅');
    }
  });

  test('駅IDが不正な場合はテキストメッセージを返す', () => {
    const message = replyToPostbackMessage('X99', jst('2024-06-10T09:30'));
    expect(message.type).toBe('text');
    expect((message as messagingApi.TextMessage).text).toContain('駅を特定できませんでした');
  });
});

describe('replyToOtherMessage', () => {
  test('非対応メッセージ形式を伝えるテキストを返す', () => {
    expect(replyToOtherMessage()).toEqual({ type: 'text', text: 'このメッセージ形式には対応していません' });
  });
});
