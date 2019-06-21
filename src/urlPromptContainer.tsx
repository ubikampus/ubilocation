import React, { useState, FormEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import queryString from 'query-string';
import UrlPrompt from './urlPrompt';
import Deserializer from './mqttDeserialize';
import { unreachable } from './typeUtil';

const DEFAULT_MQTT_BUS_URL = 'ws://localhost:9001/mqtt';
const DEFAULT_TOPIC = 'ohtu/test/locations';

const UrlPromptContainer = ({ history }: RouteComponentProps) => {
  const mqttParser = new Deserializer();
  const [busText, setBusText] = useState(DEFAULT_MQTT_BUS_URL);
  const [topicText, setTopicText] = useState(DEFAULT_TOPIC);

  // Used when user enters invalid bus value.
  const [busInputError, setBusInputError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = mqttParser.parseMqttUrl(busText);

    if (parsed.kind === 'fail') {
      setBusInputError(parsed.message);
    } else if (parsed.kind === 'success') {
      history.push(
        '/viz?' + queryString.stringify({ host: busText, topic: topicText })
      );
    } else {
      unreachable(parsed);
    }
  };

  return (
    <UrlPrompt
      busText={busText}
      onPromptSubmit={onSubmit}
      inputError={busInputError}
      setBusText={e => setBusText(e.currentTarget.value)}
      topicText={topicText}
      setTopicText={e => setTopicText(e.currentTarget.value)}
    />
  );
};

export default withRouter(UrlPromptContainer);
