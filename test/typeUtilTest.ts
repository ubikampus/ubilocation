import * as t from 'io-ts';
import { unsafeDecode } from '../src/typeUtil';

describe('unsafeDecode', () => {
  it('should parse json input', () => {
    const decoder = t.type({
      data: t.array(t.number),
    });

    const input = '{"data": [1, 2, 3]}';
    const parsed = unsafeDecode(decoder, JSON.parse(input));

    expect(parsed.data[1]).toBe(2);
  });
});
