import UbiMqtt from 'ubimqtt';

export default class MqttService {
  private mqtt: UbiMqtt = new UbiMqtt('');

  connect(url: string): Promise<MqttService> {
    this.mqtt = new UbiMqtt(url);

    return new Promise((resolve, reject) => {
      this.mqtt.connect((error: any) => {
        if (!error) {
          resolve(this);
        } else {
          reject(error);
        }
      });
    });
  }

  subscribe(topic: string, listener: any): Promise<MqttService> {
    return new Promise((resolve, reject) => {
      this.mqtt.subscribe(topic, this, listener, (error: any) => {
        if (!error) {
          resolve(this);
        } else {
          reject(error);
        }
      });
    });
  }

  subscribeSigned(
    topic: string,
    publicKeys: string[],
    listener: any
  ): Promise<MqttService> {
    return new Promise((resolve, reject) => {
      this.mqtt.subscribeSigned(
        topic,
        publicKeys,
        this,
        listener,
        (error: any) => {
          if (!error) {
            resolve(this);
          } else {
            reject(error);
          }
        }
      );
    });
  }
}
