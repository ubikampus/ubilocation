import React, { useState } from 'react';
import { Popup } from 'react-map-gl';
import {
  eyebudCall,
  eyebudStream,
  eyebudPicture,
  eyebudCommand,
} from '../common/contactEyebud';

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

const EYEBUD_PHOTO_URL = 'http://108.128.153.197:8181/photo/';

const EyebudButton = ({ text, func }: any) => (
  <div>
    <button onClick={func}>{text}</button>
  </div>
);

export const EyebudPopup = ({
  setEyebudPopup,
  setImgSrc,
  eyebud,
  imgSrc,
}: EyebudPopupProps) => {
  // const [display, setDisplay] = useState<EyebudDisplay>(null);
  const [stream, setStream] = useState<any>(null);

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
            const eid = eyebud.id;
            eyebudPicture(eyebud.id).then(id =>
              setTimeout(
                () => setImgSrc(`${EYEBUD_PHOTO_URL}${eid}/${id}`),
                10000
              )
            );
          }}
        />
        <EyebudButton
          text={stream ? 'stop stream' : 'start stream'}
          func={() => {
            if (!stream) {
              const eId = eyebud.id;
              eyebudStream(eId).then(id => {
                let incId = id;

                setStream(
                  setInterval(() => {
                    setImgSrc(
                      `${EYEBUD_PHOTO_URL}${eId}/${incId}?time=${+new Date()}`
                    );
                    incId++;
                    incId %= 10;
                  }, 2000)
                );
              });
            } else {
              clearInterval(stream);
              setImgSrc(null);
              setStream(null);
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
        {imgSrc ? <img src={imgSrc} width={400} /> : null}
      </div>
    </Popup>
  );
};
