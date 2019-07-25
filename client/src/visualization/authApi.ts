import axios from 'axios';
const baseUrl = 'http://localhost:3001';

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

export interface Signature {
  protected: any;
  signature: string;
}

export interface SignedMessage {
  payload: string;
  signatures: Signature[];
}

const login = async (credentials: Credentials): Promise<Admin> => {
  const url = `${baseUrl}/login`;
  const response = await axios.post<Admin>(url, credentials);
  return response.data;
};

const sign = async (message: string, token: string): Promise<SignedMessage> => {
  const url = `${baseUrl}/sign`;
  const config = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  const response = await axios.post<SignedMessage>(url, { message }, config);
  return response.data;
};

export default { login, sign };
