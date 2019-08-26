import axios from 'axios';
import { currentEnv } from '../common/environment';

const API_URL = currentEnv.API_URL;

export interface Credentials {
  username: string;
  password: string;
}

/**
 * Note: The following types are shared with auth-server.
 * In other words, auth-server contains equivalent type specifications.
 */
export interface Admin {
  token: string;
  username: string;
}

export interface Signature<T> {
  protected: T;
  signature: string;
}

export interface SignedMessage<T = any> {
  payload: string;
  signatures: Array<Signature<T>>;
}

export interface Reservation {
  startTime: Date;
  endTime: Date;
}

export interface Rooms {
  [room: string]: {
    free: boolean;
    reservations: Reservation[];
  };
}

const login = async (credentials: Credentials): Promise<Admin> => {
  const url = `${API_URL}/login`;
  const response = await axios.post<Admin>(url, credentials);
  return response.data;
};

const sign = async (message: string, token: string): Promise<SignedMessage> => {
  const url = `${API_URL}/sign`;
  const config = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  const response = await axios.post<SignedMessage>(url, { message }, config);
  return response.data;
};

const reservations = async (): Promise<Rooms> => {
  const url = `${API_URL}/reservations`;
  const response = await axios.get(url);
  return response.data;
};

export default { login, sign, reservations };
