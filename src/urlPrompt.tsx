import React, { ChangeEvent, FormEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import qs from 'qs';

const onSubmit = (history: History, bus: string, topic: string) => (
  e: FormEvent
) => {
  e.preventDefault();
  history.push('/viz?' + qs.stringify({ host: bus, topic }));
};

interface Props {
  busText: string;
  topicText: string;
  setBusText(a: ChangeEvent<HTMLInputElement>): void;
  setTopicText(a: ChangeEvent<HTMLInputElement>): void;
}

const UrlPrompt = ({
  history,
  busText,
  topicText,
  setBusText,
  setTopicText,
}: RouteComponentProps & Props) => (
  <>
    <h3>Ubikampus bluetooth visualizer</h3>
    <form onSubmit={onSubmit(history, busText, topicText)}>
      <div>
        mqtt bus url
        <input name="busUrl" autoFocus value={busText} onChange={setBusText} />
      </div>
      <div>
        mqtt topic
        <input name="topic" value={topicText} onChange={setTopicText} />
      </div>
      <button>connect to real mqtt bus</button>
    </form>
    <button
      onClick={() => {
        history.push('/viz');
      }}
    >
      use mocked bluetooth beacons
    </button>
  </>
);

export default withRouter(UrlPrompt);
