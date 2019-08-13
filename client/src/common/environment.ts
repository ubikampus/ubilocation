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
});

export type Env = t.TypeOf<typeof EnvDecoder>;

/**
 * Pull environment variable from webpack configuration.
 */
const loadEnv = (): Env => {
  return unsafeDecode(EnvDecoder, {
    NODE_ENV: DEFINE_NODE_ENV,
  });
};

export const currentEnv = loadEnv();
