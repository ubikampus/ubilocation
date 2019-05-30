import React, { useState } from 'react';
import UrlPrompt from './urlPrompt';

const DEFAULT_MQTT_BUS_URL = 'ws://localhost:8080/mqtt';

const UrlPromptContainer = () => {
  const [busText, setBusText] = useState(DEFAULT_MQTT_BUS_URL);
  const [topicText, setTopicText] = useState('topicText');

  return (
    <UrlPrompt
      busText={busText}
      setBusText={e => setBusText(e.currentTarget.value)}
      topicText={topicText}
      setTopicText={e => setTopicText(e.currentTarget.value)}
    />
  );
};

export default UrlPromptContainer;
