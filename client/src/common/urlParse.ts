import * as t from 'io-ts';
import queryStringParser from 'query-string';
import { unsafeDecode } from './typeUtil';

/**
 * Parse query string into regular javascript object.
 *
 * @param type Decoder for the deserialized object
 * @param queryString see https://en.wikipedia.org/wiki/Query_string
 */
export const parseQuery = <A>(
  type: t.Decoder<unknown, A>,
  queryString: string
) => {
  const parsed = queryStringParser.parse(queryString, {
    parseNumbers: true,
  });

  return unsafeDecode<A>(type, parsed);
};

export const MapLocationQueryDecoder = t.type({
  lat: t.union([t.undefined, t.number]),
  lon: t.union([t.undefined, t.number]),
  host: t.union([t.string, t.undefined]),
  topic: t.union([t.string, t.undefined]),
  track: t.union([t.string, t.undefined]),
});

export const VizQueryDecoder = t.type({ host: t.string, topic: t.string });

export type VizQuery = t.TypeOf<typeof VizQueryDecoder>;
