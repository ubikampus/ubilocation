import * as t from 'io-ts';
import { env } from 'process';
import { unsafeDecode } from './typeUtil';

const EnvDecoder = t.union([t.literal('development'), t.literal('production')]);
type Env = t.TypeOf<typeof EnvDecoder>;

export const currentEnv = (): Env => {
  return unsafeDecode(EnvDecoder, env.NODE_ENV || '');
};
