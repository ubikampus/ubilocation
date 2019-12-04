import Axios from 'axios';

const EYEBUD_SERVER_URL = 'http://localhost:5000';

export const eyebudCommand = async (id: string, command: string) => {
  const url = `${EYEBUD_SERVER_URL}/${id}/${command}`;
  const response = await Axios.post(url);

  return response.data;
};

export const taskCommand = async (
  eyebuds: string[],
  task: string,
  details: string
) => {
  console.log('TASK', task);
  const response = await Axios.post(EYEBUD_SERVER_URL + '/task/' + task, {
    employee_list: eyebuds,
    details,
  });

  return response.data;
};

export const eyebudCall = async (id: string) => {
  return await eyebudCommand(id, 'send_audio');
};

export const eyebudStream = async (id: string) => {
  return await eyebudCommand(id, 'start_photo_stream');
};

export const eyebudPicture = async (id: string) => {
  return await eyebudCommand(id, 'take_photo');
};
