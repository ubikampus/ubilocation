import axios from 'axios';
import { currentEnv } from '../common/environment';

const API_URL = currentEnv.API_URL;

/**
 * Note: This type definition is shared with auth-server
 */
export interface Beacon {
  token: string;
  beaconId: string;
}

const registerBeacon = async (beaconId: string): Promise<Beacon> => {
  const url = `${API_URL}/register`;
  const response = await axios.post<Beacon>(url, { beaconId });
  return response.data;
};

export default { registerBeacon };
