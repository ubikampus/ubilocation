import * as UbiMqtt from 'ubimqtt';

const MQTT_BUS_URL = '10.120.0.4';

/**
 * See mqtt docs https://github.com/ubikampus/ubimqtt
 */
const main = () => {
  const client = new UbiMqtt(MQTT_BUS_URL);
};

main();
