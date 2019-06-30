/**
 * TODO: remove duplication in this module?
 */

import React, { MutableRefObject, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { default as UbiMqtt } from 'ubimqtt';
import { FakeMqttGenerator } from '../location/mqttConnection';
import Deserializer, { VizQueryDecoder } from '../location/mqttDeserialize';
import Screen3D from './screen3d';

export const MockBusContainer = () => {
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null) as any;
  useEffect(() => {
    const screen = new Screen3D(canvasRef.current);

    const mockGenerator = new FakeMqttGenerator(new Deserializer(), msg => {
      screen.updateBeacons(msg);
    });

    return () => {
      console.log('disposing all babylon resources...');
      mockGenerator.stop();
      screen.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export const GenuineBusContainer = ({
  location: { search },
}: RouteComponentProps) => {
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null) as any;
  const parser = new Deserializer();

  const params = parser.parseQuery(VizQueryDecoder, search);

  useEffect(() => {
    const screen = new Screen3D(canvasRef.current);
    const ubiClient = new UbiMqtt(params.host);

    console.log('connecting to ubimqtt', params.host);
    ubiClient.connect((error: any) => {
      if (error) {
        console.error('error connecting to mqtt bus', error);
      } else {
        console.log('subscribing to topic', params.topic);
        ubiClient.subscribe(
          params.topic,
          null,
          (topic: string, rawMessage: string) => {
            const parsed = parser.deserializeMessage(rawMessage);
            screen.updateBeacons(parsed);
          },
          (subErr: any) => {
            if (subErr) {
              console.error('error subscribing to topic', subErr);
            }
          }
        );
      }
    });

    return () => {
      console.log('disconnecting from mqtt bus...');
      ubiClient.forceDisconnect((err: any) => {
        if (err) {
          console.error('error disconnecting ubiclient', err);
        }

        console.log('disposing all babylon resources...');
        screen.dispose();
      });
    };
  }, []);

  return <canvas ref={canvasRef} />;
};
