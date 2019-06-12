import MqttParser, { MqttMessage } from './mqttDeserialize';

const MOCK_MESSAGE_INTERVAL = 2000;

export class FakeMqttGenerator {
  intervalRef: NodeJS.Timeout;
  onMessage: (a: MqttMessage[]) => void;
  mqttParser: MqttParser;

  constructor(
    mqttParser: MqttParser,
    onMessage: (a: MqttMessage[]) => void,
    interval: number = MOCK_MESSAGE_INTERVAL
  ) {
    this.onMessage = onMessage;
    console.log('generating mock messages...');
    this.intervalRef = setInterval(this.generateMessages, interval);
    this.mqttParser = mqttParser;
  }

  generateMessages = () => {
    // TODO: set 3d model maximum length as possible upper limit
    const count = Math.ceil(Math.random() * 5);

    const messages = Array.from(Array(count).keys()).map(id => {
      const x = Math.floor((Math.random() * 1024) / 2);
      const y = Math.floor((Math.random() * 768) / 2);
      const z = Math.floor((Math.random() * 500) / 2);

      const messageStr = JSON.stringify({
        beaconId: `beacon-${id}`,
        x,
        y,
        z,

        // TODO: generate error values in with Math.random
        xr: Math.random(),
        yr: Math.random(),
        zr: Math.random(),
        alignment: 0 - Math.random(),
      });

      const parsed = this.mqttParser.deserializeMessage(messageStr);

      return parsed;
    });

    this.onMessage(messages);
  };

  stop() {
    clearInterval(this.intervalRef);
    console.log('stopped generating mock messages');
  }
}
