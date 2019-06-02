import * as t from 'io-ts';
import { env } from 'process';
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

export const currentEnv = (): Env => {
  return unsafeDecode(EnvDecoder, env);
};
