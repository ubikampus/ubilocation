import qs from 'qs';
import React, { MutableRefObject, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { startMessageMocker, connectUbiTopic } from './mqttConnection';
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
    console.log('connecting...');
    connectUbiTopic(
      params.host,
      params.topic,
      raw => {
        const parsed = deserializeMessage(raw);
        screen.setPosition(beacon, parsed.x, parsed.y);
      },
      () => {
        console.log('connected to', params.host);
      }
    );

    return () => {
      console.log('disposing all babylon resources...');
      screen.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};
