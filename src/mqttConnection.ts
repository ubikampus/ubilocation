import * as UbiMqtt from 'ubimqtt';

/**
 * See mqtt docs https://github.com/ubikampus/ubimqtt
 *
 * Connect to Ubikampus MQTT bus and subscribe to single topic.
 */
export const connectUbiTopic = (
  uri: string,
  topic: string,
  onMessage: (msg: string) => void
) => {
  /**
   * Drop the topic message, because we already know what topic we are using.
   */
  const onMessageWrapper = (_: string, msg: string) => {
    onMessage(msg);
  };

  const client = new UbiMqtt(uri);
  console.log('instantiated client, connecting to', uri);

  client.connect((error: any) => {
    if (error) {
      console.error('error during connect', error);
    } else {
      console.log('connected...');

      client.subscribe(topic, null, onMessageWrapper, (subErr: any) => {
        if (subErr) {
          console.error('error subscribing to topic', subErr);
        } else {
          console.log('successfully subscribed to topic', topic);
        }
      });
    }
  });
};
