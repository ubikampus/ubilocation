import * as t from 'io-ts';
import { unsafeDecode } from './typeUtil';

const EnvDecoder = t.type({
  NODE_ENV: t.union([
    t.literal('development'),
    t.literal('production'),

    /**
     * Jest manipulates NODE_ENV to 'test' during test runs.
     */
    t.literal('test'),
  ]),
  API_URL: t.string,
  TILE_URL: t.string,
});

export type Env = t.TypeOf<typeof EnvDecoder>;

/**
 * Pull environment variable from webpack configuration.
 */
const loadEnv = (): Env => {
  return unsafeDecode(EnvDecoder, {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.API_URL,
    TILE_URL: process.env.TILE_URL,
  });
};

export const currentEnv = loadEnv();
