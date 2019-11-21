import React, { useState } from 'react';
import { Popup } from 'react-map-gl';
import {
  eyebudCall,
  eyebudStream,
  eyebudPicture,
} from '../common/contactEyebud';

interface EyebudPopupProps {
  setEyebudPopup: any;
  setImgSrc: any;
  eyebud: any;
  imgSrc: any;
}

const EYEBUD_PHOTO_URL = 'http://108.128.153.197:8181/photo/E3-028/';

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
  const [stream, setStream] = useState<any>(null);

  return (
    <div>
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
          Eyebud: {eyebud.id}
          <EyebudButton text="call" func={() => eyebudCall(eyebud.id)} />
          <EyebudButton
            text="photo"
            func={() => {
              eyebudPicture(eyebud.id).then(id =>
                setTimeout(() => setImgSrc(`${EYEBUD_PHOTO_URL}${id}`), 10000)
              );
            }}
          />
          <EyebudButton
            text={stream ? 'stop stream' : 'start stream'}
            func={() => {
              if (!stream) {
                eyebudStream(eyebud.id).then(id => {
                  let incId = id;

                  setStream(
                    setInterval(() => {
                      setImgSrc(
                        `${EYEBUD_PHOTO_URL}${incId}?time=${+new Date()}`
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
          {imgSrc ? <img src={imgSrc} width={400} /> : null}
        </div>
      </Popup>
    </div>
  );
};
