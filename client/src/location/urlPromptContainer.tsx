import React, { useState, FormEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import queryString from 'query-string';
import UrlPrompt from './urlPrompt';

export const DEFAULT_TOPIC = 'ohtu/test/locations';

interface Props {
  mqttUrl: string;
}

const UrlPromptContainer = ({
  history,
  mqttUrl,
}: RouteComponentProps & Props) => {
  const [topicText, setTopicText] = useState(DEFAULT_TOPIC);

  const mqttQueryString = queryString.stringify({
    host: mqttUrl,
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
