import React from 'react';
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
}: EyebudPopupProps) => (
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
        <EyebudButton text="photo" func={() => eyebudPicture(eyebud.id)} />
        <EyebudButton text="stream" func={() => eyebudStream(eyebud.id)} />
        {imgSrc ? <img src={imgSrc} width={400} /> : null}
      </div>
    </Popup>
  </div>
);
