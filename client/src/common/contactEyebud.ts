import Axios from 'axios';

const EYEBUD_SERVER_URL = 'http://localhost:5000';

export const eyebudCommand = async (id: number, command: string) => {

  const response = await Axios.post(EYEBUD_SERVER_URL, { id, command });

  return response.data.url;
};

export const eyebudCall = async (id: number) => {
  return await eyebudCommand(id, 'send_audio');
};

export const eyebudStream = async (id: number) => {
  return await eyebudCommand(id, 'photo_stream');
};

export const eyebudPicture = async (id: number) => {
  return await eyebudCommand(id, 'take_photo');
};
