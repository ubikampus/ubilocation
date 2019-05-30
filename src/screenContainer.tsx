import React, { useRef, useEffect, MutableRefObject } from 'react';
import { startMessageMocker } from './mqttConnection';
import Screen3D from './screen3d';

const ScreenContainer = () => {
  const canvasRef: MutableRefObject<HTMLCanvasElement> = useRef(null) as any;
  let updateLocation: NodeJS.Timeout;
  let screen: Screen3D;

  useEffect(() => {
    screen = new Screen3D(canvasRef.current);
    const beacon = screen.addBeacon('beacon-1');

    updateLocation = startMessageMocker('beacon_hash_123', message => {
      screen.setPosition(beacon, message.x, message.y);
    });

    return () => {
      console.log('disposing all babylon resources...');
      clearInterval(updateLocation);
      screen.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default ScreenContainer;
