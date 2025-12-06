import { describe, expect, it } from 'vitest';
import { getLineById } from '../src/lines';

describe('getLineById', () => {
  it('Nのとき南北線の路線情報を返す', () => {
    const line = getLineById('N');
    expect(line).toBeDefined();
    expect(line?.id).toBe('N');
  });

  it('Tのとき東西線の路線情報を返す', () => {
    const line = getLineById('T');
    expect(line).toBeDefined();
    expect(line?.id).toBe('T');
  });

  it('Hのとき東豊線の路線情報を返す', () => {
    const line = getLineById('H');
    expect(line).toBeDefined();
    expect(line?.id).toBe('H');
  });

  it('一致しない場合はundefinedを返す', () => {
    const invalidId = 'A' as any;
    const line = getLineById(invalidId);
    expect(line).toBeUndefined();
  });
});
