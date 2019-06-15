import MqttParser, { MqttMessage } from './mqttDeserialize';

const MOCK_MESSAGE_INTERVAL = 2000;

const ROOM_HEIGHT_METERS = 3.8;

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
    const count = Math.ceil(Math.random() * 5);

    const messages = Array.from(Array(count).keys()).map(id => {
      // Pick a random position on the 2nd floor
      const x = 34 * Math.random();
      const y = 7.25 + 35 * Math.random();
      const z = ROOM_HEIGHT_METERS * Math.random();

      const messageStr = JSON.stringify({
        beaconId: `beacon-${id}`,
        x,
        y,
        z,
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
