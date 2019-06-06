/**
 * TODO: remove duplication in this module?
 */

import qs from 'qs';
import React, { MutableRefObject, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { default as UbiMqtt } from 'ubimqtt';
import { startMessageMocker } from './mqttConnection';
import { VizQueryDecoder, deserializeMessage } from './mqttDeserialize';
import Screen3D from './screen3d';
import { unsafeDecode } from './typeUtil';

export const MockBusContainer = () => {
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null) as any;

  useEffect(() => {
    const screen = new Screen3D(canvasRef.current);
    const beacon = screen.addBeacon('beacon-1');

    const mockerId = startMessageMocker('beacon_hash_123', message => {
      screen.setPosition(beacon, message.x, message.y);
    });

    return () => {
      console.log('disposing all babylon resources...');
      clearInterval(mockerId);
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
    const beacon = screen.addBeacon('beacon-1');
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
            console.log('rawmessage', rawMessage);
            const parsed = deserializeMessage(rawMessage);
            screen.setPosition(beacon, parsed.x, parsed.y);
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
      ubiClient.disconnect(() => {
        console.log('disposing all babylon resources...');
        screen.dispose();
      });
    };
  }, []);

  return <canvas ref={canvasRef} />;
};
