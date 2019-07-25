import axios from 'axios';
const baseUrl = 'http://localhost:3001';

export interface Credentials {
  username: string;
  password: string;
}

export interface Admin {
  token: string;
  username: string;
}

const login = async (credentials: Credentials) => {
  const url = `${baseUrl}/login`;
  const response = await axios.post(url, credentials);
  return response.data;
};

const sign = async (message: string, token: string) => {
  const url = `${baseUrl}/sign`;
  const config = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  const response = await axios.post(url, { message }, config);
  return response.data;
};

export default { login, sign };
