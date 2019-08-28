import { RequestHandler } from 'express';
import { appConfig, ClientConfig } from '../validation';

const config: RequestHandler = async (_, res) => {
  await res.json({
    INITIAL_LATITUDE: appConfig.INITIAL_LATITUDE,
    INITIAL_LONGITUDE: appConfig.INITIAL_LONGITUDE,
    INITIAL_ZOOM: appConfig.INITIAL_ZOOM,
    MINIMUM_ZOOM: appConfig.MINIMUM_ZOOM,
    WEB_MQTT_URL: appConfig.WEB_MQTT_URL,
  } as ClientConfig);
};

export default config;
