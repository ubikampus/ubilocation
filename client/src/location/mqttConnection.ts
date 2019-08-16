import { useState, useEffect } from 'react';
import { default as UbiMqtt } from 'ubimqtt';
import Deserializer, {
  BabylonBeacon,
  mqttMessageToBabylon,
  BeaconGeoLocation,
  MqttMessage,
  mqttMessageToGeo,
} from './mqttDeserialize';
import queryString from 'query-string';
import { DEFAULT_TOPIC } from '../location/urlPromptContainer';

const MOCK_MESSAGE_INTERVAL = 2000;

const ROOM_HEIGHT_METERS = 3.8;

export const refreshBeacons = (
  parsed: MqttMessage[],
  beaconId: string | null,
  lastKnownPosition: BeaconGeoLocation | null
) => {
  const geoBeacons = parsed.map(i => mqttMessageToGeo(i));

  const ourBeacon = geoBeacons.find(beacon => beacon.beaconId === beaconId);

  return {
    beacons: geoBeacons,
    lastKnownPosition: ourBeacon !== undefined ? ourBeacon : lastKnownPosition,
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

export const useUbiMqtt = (
  host: string,
  beaconId: string | null,
  topic?: string
) => {
  const parser = new Deserializer();

  const [beacons, setBeacons] = useState<BeaconGeoLocation[]>([]);
  const [
    lastKnownPosition,
    setLastKnownPosition,
  ] = useState<null | BeaconGeoLocation>(null);

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

            const nextBeacons = refreshBeacons(
              locations,
              beaconId,
              lastKnownPosition
            );

            setBeacons(nextBeacons.beacons);
            setLastKnownPosition(nextBeacons.lastKnownPosition);
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

  return { beacons, lastKnownPosition };
};

export class FakeMqttGenerator {
  intervalRef: number;
  onMessage: (a: BabylonBeacon[]) => void;
  mqttParser: Deserializer;

  constructor(
    mqttParser: Deserializer,
    onMessage: (a: BabylonBeacon[]) => void,
    interval: number = MOCK_MESSAGE_INTERVAL
  ) {
    this.onMessage = onMessage;
    console.log('generating mock messages...');
    this.intervalRef = setInterval(this.generateMessages, interval);
    this.mqttParser = mqttParser;
  }

  generateMessages = () => {
    const count = Math.ceil(Math.random() * 5);

    const messages = Array.from(Array(count).keys()).map(id => {
      // Pick a random position on the 2nd floor
      const x = 34000 * Math.random();
      const y = 7250 + 35000 * Math.random();
      const z = ROOM_HEIGHT_METERS * 1000 * Math.random();

      const parsed = {
        beaconId: `beacon-${id}`,
        x,
        y,
        z,
        xr: Math.random(),
        yr: Math.random(),
        zr: Math.random(),
        alignment: 0 - Math.random(),
      };

      return mqttMessageToBabylon(parsed);
    });

    this.onMessage(messages);
  };

  stop() {
    clearInterval(this.intervalRef);
    console.log('stopped generating mock messages');
  }
}
