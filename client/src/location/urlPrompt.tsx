import React, { ChangeEvent, FormEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

interface Props {
  topicText: string;
  mqttQueryString: string;
  onPromptSubmit(a: FormEvent): void;
  setTopicText(a: ChangeEvent<HTMLInputElement>): void;
}

const UrlPrompt = ({
  topicText,
  mqttQueryString,
  setTopicText,
  onPromptSubmit,
}: RouteComponentProps & Props) => (
  <>
    <h3>Ubilocation</h3>
    <form id="urlPromptForm" onSubmit={onPromptSubmit}>
      <div>
        mqtt topic
        <input name="topic" value={topicText} onChange={setTopicText} />
      </div>
      <button>Go to mapbox map</button>
    </form>
    <Link to={'/viz?' + mqttQueryString}>
      <button>3d model with real data</button>
    </Link>
    <div>
      <Link to="/mockviz">
        <button>3d model with mocked locations</button>
      </Link>
    </div>
  </>
);

export default withRouter(UrlPrompt);
