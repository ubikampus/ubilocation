import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { isLeft } from 'fp-ts/lib/Either';

/**
 * See typeUtil.ts in client.
 */
export const unsafeDecode = <A>(d: t.Decoder<unknown, A>, value: unknown) => {
  const decoded = d.decode(value);

  if (isLeft(decoded)) {
    PathReporter.report(decoded).forEach(error => {
      console.error(error);
    });

    throw new Error('failed to parse type');
  } else {
    return decoded.right;
  }
};

const tryParseConfig = () => {
  try {
    return unsafeDecode(AppConfig, {
      INITIAL_LATITUDE: parseFloat(process.env.INITIAL_LATITUDE as string),
      INITIAL_LONGITUDE: parseFloat(process.env.INITIAL_LONGITUDE as string),
      INITIAL_ZOOM: parseInt(process.env.INITIAL_ZOOM as string, 10),
      ADMIN_USER: process.env.ADMIN_USER,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      JWT_SECRET: process.env.JWT_SECRET,
      MINIMUM_ZOOM: parseInt(process.env.MINIMUM_ZOOM as string, 10),
      WEB_MQTT_URL: process.env.WEB_MQTT_URL,
      SERVER_MQTT_URL: process.env.SERVER_MQTT_URL,
    });
  } catch (e) {
    throw new Error(
      'failed to parse configuration, please check README for environment variables.'
    );
  }
};

export const ClientConfigDecoder = t.type({
  INITIAL_LATITUDE: t.number,
  INITIAL_LONGITUDE: t.number,
  INITIAL_ZOOM: t.number,
  MINIMUM_ZOOM: t.number,
  WEB_MQTT_URL: t.string,
});

export type ClientConfig = t.TypeOf<typeof ClientConfigDecoder>;

export const AppConfig = t.intersection([
  t.type({
    ADMIN_USER: t.string,
    ADMIN_PASSWORD: t.string,

    JWT_SECRET: t.string,
    SERVER_MQTT_URL: t.string,
  }),
  ClientConfigDecoder,
]);

export type AppConfigT = t.TypeOf<typeof AppConfig>;

export const appConfig = tryParseConfig();
