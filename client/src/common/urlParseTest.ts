import * as t from 'io-ts';
import { parseQuery } from './urlParse';

describe('query string parsing', () => {
  it('should throw if required number is missing', () => {
    const queryDecoder = t.type({
      lat: t.number,
      lon: t.number,
    });

    expect(() => {
      parseQuery(queryDecoder, '?lon=60.1');
    }).toThrow();
  });

  it('should parse float in the query string', () => {
    const decoder = t.type({
      lat: t.number,
    });

    expect(parseQuery(decoder, '?lat=50.5').lat).toBeCloseTo(50.5);
    expect(parseQuery(decoder, 'lat=50.1').lat).toBeCloseTo(50.1);
  });
});
