import MqttParser, { MqttMessage } from './mqttDeserialize';

const MOCK_MESSAGE_INTERVAL = 2000;

export class FakeMqttGenerator {
  intervalRef: NodeJS.Timeout;
  onMessage: (a: MqttMessage) => void;
  beaconId: string;
  mqttParser: MqttParser;

  constructor(
    beaconId: string,
    mqttParser: MqttParser,
    onMessage: (a: MqttMessage) => void,
    interval: number = MOCK_MESSAGE_INTERVAL
  ) {
    this.onMessage = onMessage;
    console.log('generating mock messages...');
    this.intervalRef = setInterval(this.generateMessage, interval);
    this.beaconId = beaconId;
    this.mqttParser = mqttParser;
  }

  generateMessage = () => {
    // TODO: set 3d model maximum length as possible upper limit
    const x = Math.floor((Math.random() * 1024) / 2);
    const y = Math.floor((Math.random() * 768) / 2);

    const messageStr = JSON.stringify({
      beaconId: this.beaconId,
      x,
      y,
      z: 0,

      // TODO: generate error values in with Math.random
      xr: 0.5,
      yr: 0.9,
      zr: 0.2,
      alignment: 123,
    });

    const message = this.mqttParser.deserializeMessage(messageStr);
    this.onMessage(message);
  };

  stop() {
    clearInterval(this.intervalRef);
    console.log('stopped generating mock messages');
  }
}
