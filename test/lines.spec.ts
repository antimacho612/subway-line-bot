import { getLineById } from '../src/lines';

test('getLineById関数', () => {
  expect(getLineById('N')?.name).toBe('南北線');
  expect(getLineById('T')?.name).toBe('東西線');
  expect(getLineById('H')?.name).toBe('東豊線');
});
