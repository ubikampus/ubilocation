import React, { useState, FormEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import queryString from 'query-string';
import UrlPrompt from './urlPrompt';
import { currentEnv } from '../common/environment';

const MQTT_DEV_URL = 'ws://localhost:9001/mqtt';
const MQTT_PROD_URL = 'ws://iot.ubikampus.net:9001/mqtt';

// TODO: move these into more reasonable module.
export const MQTT_URL =
  currentEnv.NODE_ENV === 'production' ? MQTT_PROD_URL : MQTT_DEV_URL;

export const DEFAULT_TOPIC = 'ohtu/test/locations';

const UrlPromptContainer = ({ history }: RouteComponentProps) => {
  const [topicText, setTopicText] = useState(DEFAULT_TOPIC);

  const mqttQueryString = queryString.stringify({
    host: MQTT_URL,
    topic: topicText,
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    history.push('/?' + mqttQueryString);
  };

  return (
    <div>
      <UrlPrompt
        onPromptSubmit={onSubmit}
        mqttQueryString={mqttQueryString}
        topicText={topicText}
        setTopicText={e => setTopicText(e.currentTarget.value)}
      />
    </div>
  );
};

export default withRouter(UrlPromptContainer);
