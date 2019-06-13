/**
 * TODO: remove duplication in this module?
 */

import qs from 'qs';
import React, { MutableRefObject, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { default as UbiMqtt } from 'ubimqtt';
import { FakeMqttGenerator } from './mqttConnection';
import MqttParser, { VizQueryDecoder } from './mqttDeserialize';
import Screen3D from './screen3d';
import { unsafeDecode } from './typeUtil';

export const MockBusContainer = () => {
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null) as any;
  useEffect(() => {
    const screen = new Screen3D(canvasRef.current);

    const mockGenerator = new FakeMqttGenerator(new MqttParser(), msg => {
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

  const params = unsafeDecode(
    VizQueryDecoder,
    qs.parse(search, { ignoreQueryPrefix: true })
  );

  useEffect(() => {
    const screen = new Screen3D(canvasRef.current);
    const ubiClient = new UbiMqtt(params.host);
    const mqttParser = new MqttParser();

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
            const parsed = mqttParser.deserializeMessage(rawMessage);
            screen.updateBeacons([parsed]);
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
      ubiClient.disconnect((err: any) => {
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
