import * as t from 'io-ts';
import { unsafeDecode } from './typeUtil';
import axios from 'axios';

const ClientConfigDecoder = t.type({
  INITIAL_LATITUDE: t.number,
  INITIAL_LONGITUDE: t.number,
  INITIAL_ZOOM: t.number,
  MINIMUM_ZOOM: t.number,
  WEB_MQTT_URL: t.string,
});

export type ClientConfig = t.TypeOf<typeof ClientConfigDecoder>;

export const fetchConfig = async () => {
  const response = await axios.get(`${process.env.API_URL}/config`);

  return unsafeDecode(ClientConfigDecoder, response.data);
};

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
