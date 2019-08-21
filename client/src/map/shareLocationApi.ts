import axios from 'axios';
import { currentEnv } from '../common/environment';

const API_URL = currentEnv.API_URL;
const PUBLIC_URL = `${API_URL}/public`;

/**
 * Note: This type definition is shared with auth-server
 */
export interface Beacon {
  token: string;
  beaconId: string;
  nickname: string;
}

const registerBeacon = async (beaconId: string): Promise<Beacon> => {
  const url = `${API_URL}/register`;
  const response = await axios.post<Beacon>(url, { beaconId });
  return response.data;
};

const fetchPublicBeacons = async (): Promise<Beacon[]> => {
  const response = await axios.get(PUBLIC_URL);
  return response.data;
};

const publish = async (token: string): Promise<{}> => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  const response = await axios.post(PUBLIC_URL, {}, config);
  return response.data;
};

export default { registerBeacon, fetchPublicBeacons, publish };
