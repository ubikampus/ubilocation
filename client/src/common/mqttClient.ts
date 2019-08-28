import UbiMqtt from 'ubimqtt';
import authApi from '../admin/authApi';

let connected = false;

const getConnection = async (mqttUrl: string): Promise<any> => {
  const ubiMqttClient = new UbiMqtt(mqttUrl);

  return new Promise((resolve, reject) => {
    if (connected) {
      resolve(ubiMqttClient);
    }

    ubiMqttClient.connect((error: any) => {
      if (!error) {
        connected = true;
        resolve(ubiMqttClient);
      } else {
        reject(error);
      }
    });
  });
};

const sendSignedMqttMessage = async (mqttUrl: string, message: string) => {
  let token: string | null = null;
  const admin = window.localStorage.getItem('loggedUbimapsAdmin');
  if (admin) {
    token = JSON.parse(admin).token;
  }

  if (token) {
    const signedMessage = await authApi.sign(message, token);
    const connection = await getConnection(mqttUrl);
    await connection.publish(
      'ohtu/config',
      JSON.stringify(signedMessage),
      {},
      (error: any) => {
        if (error) {
          console.log(error);
        }
      }
    );
  } else {
    console.error('authentication error');
  }
};

export default { sendSignedMqttMessage };
