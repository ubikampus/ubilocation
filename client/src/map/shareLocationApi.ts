import axios from 'axios';

/* TODO: This URL should be an environment variable */
const baseUrl = 'http://localhost:3001';

/**
 * Note: This type definition is shared with auth-server
 */
export interface Beacon {
  token: string;
  beaconId: string;
}

const registerBeacon = async (beaconId: string): Promise<Beacon> => {
  const url = `${baseUrl}/register`;
  const response = await axios.post<Beacon>(url, { beaconId });
  return response.data;
};

export default { registerBeacon };
