import React, { useState } from 'react';
import { Popup } from 'react-map-gl';
import {
  eyebudCall,
  eyebudStream,
  eyebudPicture,
  eyebudCommand,
} from '../common/contactEyebud';
import { EyebudListener } from '../common/eyebudListener';

interface Eyebud {
  id: string;
  lat: number;
  lon: number;
}

interface EyebudPopupProps {
  setEyebudPopup: any;
  setImgSrc: any;
  eyebud: Eyebud;
  imgSrc: any;
}

// type EyebudDisplay = null | 'picture' | 'video';

const owners = new Map<string, string>([
  ['E3-028', 'Brandon'],
  ['E3-030', 'Atte'],
]);

const EyebudButton = ({ text, func }: any) => (
  <div>
    <button onClick={func}>{text}</button>
  </div>
);

const eyebudListener = new EyebudListener('ws://localhost:8001');

export const EyebudPopup = ({
  setEyebudPopup,
  setImgSrc,
  eyebud,
  imgSrc,
}: EyebudPopupProps) => {
  // const [display, setDisplay] = useState<EyebudDisplay>(null);
  const [stream, setStream] = useState(false);

  return (
    <Popup
      onClose={() => {
        setEyebudPopup(null);
        setImgSrc(null);
      }}
      latitude={eyebud.lat}
      longitude={eyebud.lon}
      closeOnClick={false}
    >
      <div>
        <div>Eyebud: {eyebud.id}</div>
        <div>Owner: {owners.get(eyebud.id)}</div>
        <EyebudButton text="call" func={() => eyebudCall(eyebud.id)} />
        <EyebudButton
          text="photo"
          func={() => {
            eyebudPicture(eyebud.id);
            eyebudListener.imageEventListener(eyebud.id, setImgSrc);
          }}
        />
        <EyebudButton
          text={stream ? 'stop stream' : 'start stream'}
          func={() => {
            if (!stream) {
              eyebudStream(eyebud.id);
              eyebudListener.imageEventListener(eyebud.id, setImgSrc, true);
              setStream(true);
            } else {
              setImgSrc(null);
              setStream(false);
              eyebudCommand(eyebud.id, 'stop_photo_stream');
              eyebudListener.stopListening();
            }
          }}
        />
        <button
          onClick={() => {
            eyebudCommand(eyebud.id, 'start_video_stream');
            window.open(
              `http://108.128.153.197:8035/static/show.html?app=live&stream=${
                eyebud.id
              }`,
              'blank'
            );
          }}
        >
          video
        </button>
        {imgSrc ? (
          <img src={imgSrc + `?date=${+new Date()}`} width={400} />
        ) : null}
      </div>
    </Popup>
  );
};
