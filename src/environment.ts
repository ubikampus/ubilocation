import * as t from 'io-ts';
import process from 'process';

const EnvDecoder = t.union([t.literal('development'), t.literal('production')]);
type Env = t.TypeOf<typeof EnvDecoder>;

export const currentEnv = (): Env => {
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }

  return 'development';
};
