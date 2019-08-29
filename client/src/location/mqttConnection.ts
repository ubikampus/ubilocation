import { useState, useEffect } from 'react';
import { default as UbiMqtt } from 'ubimqtt';
import Deserializer, {
  BeaconGeoLocation,
  mqttMessageToGeo,
} from './mqttDeserialize';
import queryString from 'query-string';

const DEFAULT_TOPIC = 'ohtu/test/locations';

export const lastKnownPosCache = () => {
  let lastKnownPosition: null | BeaconGeoLocation = null;

  return (beacons: BeaconGeoLocation[], beaconId: null | string) => {
    if (beaconId !== null) {
      const ourBeacon = beacons.find(b => b.beaconId === beaconId);

      if (ourBeacon) {
        lastKnownPosition = ourBeacon;
      }
    }

    return lastKnownPosition;
  };
};

export const urlForLocation = (
  queryParams: object | null,
  lon: number,
  lat: number
) => {
  const url = document.location;

  const nextQ = queryParams ? { ...queryParams, lat, lon } : { lat, lon };

  const updatedQueryString =
    url.origin + url.pathname + '?' + queryString.stringify(nextQ);

  return updatedQueryString;
};

export const useUbiMqtt = (host: string, topic?: string) => {
  const parser = new Deserializer();

  const [beacons, setBeacons] = useState<BeaconGeoLocation[]>([]);

  useEffect(() => {
    const ubiClient = new UbiMqtt(host, { silent: true });
    ubiClient.connect((error: any) => {
      if (error) {
        console.error('error connecting to ubi mqtt', error);
      } else {
        console.log('connected to', host);
        ubiClient.subscribe(
          topic || DEFAULT_TOPIC,
          null,
          (connectedTopic: string, msg: string) => {
            const locations = parser.deserializeMessage(msg);
            if (!locations) {
              return;
            }

            const nextBeacons = locations.map(i => mqttMessageToGeo(i));
            setBeacons(nextBeacons);
          },
          (err: any) => {
            if (err) {
              console.error('error during sub', err);
            }
          }
        );
      }
    });

    return () => {
      ubiClient.forceDisconnect(() => {
        console.log('disconnected from ubimqtt');
      });
    };
  }, []);

  return beacons;
};
