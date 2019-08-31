import axios from 'axios';
import { currentEnv } from '../common/environment';
import { AndroidLocation } from './adminPanel';

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

export interface SignedMessage<T> {
  payload: string;
  signatures: Array<Signature<T>>;
}

const login = async (credentials: Credentials): Promise<Admin> => {
  const url = `${API_URL}/login`;
  const response = await axios.post<Admin>(url, credentials);
  return response.data;
};

const sign = async <T>(
  message: string,
  token: string
): Promise<SignedMessage<T>> => {
  const url = `${API_URL}/sign`;
  const config = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  const response = await axios.post<SignedMessage<T>>(url, { message }, config);
  return response.data;
};

export const formatAndroidLocations = (devices: AndroidLocation[]) => {
  const formattedDevices = devices.map(d => {
    return {
      observerId: d.name,
      position: [d.lon, d.lat, d.height],
    };
  });

  return JSON.stringify(formattedDevices);
};

export default { login, sign };
