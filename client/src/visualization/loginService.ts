import axios from 'axios';
const baseUrl = 'http://localhost:3001/login';

export interface Credentials {
  username: string;
  password: string;
}

const login = async (credentials: Credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
