import axios, { AxiosRequestConfig } from 'axios';
import { currentEnv } from '../common/environment';

const API_URL = currentEnv.API_URL;
const PUBLIC_URL = `${API_URL}/public`;

/**
 * Note: These type definitions are shared with auth-server
 */
export interface Beacon {
  token: string;
  beaconId: string;
}

export interface PublicBeacon {
  beaconId: string;
  nickname: string;
}

const registerBeacon = async (beaconId: string): Promise<Beacon> => {
  const url = `${API_URL}/register`;
  const response = await axios.post<Beacon>(url, { beaconId });
  return response.data;
};

const fetchPublicBeacons = async (): Promise<PublicBeacon[]> => {
  const response = await axios.get(PUBLIC_URL);
  return response.data;
};

const fetchOnePublicBeacon = async (
  beaconId: string
): Promise<PublicBeacon> => {
  // TODO: URL ENCODE THE BEACON ID !!
  const url = `${PUBLIC_URL}/${beaconId}`;
  const response = await axios.get(url);
  return response.data;
};

const isPublic = async (beaconId: string): Promise<boolean> => {
  try {
    // TODO: URL ENCODE THE BEACON ID !!
    const url = `${PUBLIC_URL}/${beaconId}`;
    await axios.get(url);

    // Returned 200: the beacon is on the list of public beacons
    return true;
  } catch (e) {
    // Returned 404: the beacon is not on the list
    return false;
  }
};

const publish = async (token: string): Promise<PublicBeacon> => {
  const config = getConfig(token);
  const response = await axios.post<PublicBeacon>(PUBLIC_URL, {}, config);
  return response.data;
};

const unpublish = async (beaconId: string, token: string): Promise<{}> => {
  // TODO: URL ENCODE THE BEACON ID !!
  const url = `${PUBLIC_URL}/${beaconId}`;
  const config = getConfig(token);
  const response = await axios.delete<{}>(url, config);
  return response.data;
};

const getConfig = (token: string): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
};

export default {
  registerBeacon,
  isPublic,
  fetchOnePublicBeacon,
  fetchPublicBeacons,
  publish,
  unpublish,
};
