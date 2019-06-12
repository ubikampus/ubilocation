import React, { useState, FormEvent, Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import qs from 'qs';
import UrlPrompt from './urlPrompt';
import MqttParser from './mqttDeserialize';
import { unreachable } from './typeUtil';

const DEFAULT_MQTT_BUS_URL = 'ws://localhost:9001/mqtt';
const DEFAULT_TOPIC = 'ohtu/test/locations';

const UrlPromptContainer = withRouter(({ history }: RouteComponentProps) => {
  const mqttParser = new MqttParser();
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
      history.push('/viz?' + qs.stringify({ host: busText, topic: topicText }));
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
});

export default UrlPromptContainer;
