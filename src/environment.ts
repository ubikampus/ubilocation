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
export const currentEnv = (envVar: string): Env => {
  return unsafeDecode(EnvDecoder, {
    NODE_ENV: envVar,
  });
};

export const apiRoot = () => {
  const env = currentEnv(DEFINE_NODE_ENV);

  if (env.NODE_ENV === 'production') {
    return '/bluetooth-dev-visualizer';
  } else {
    return '/';
  }
};
