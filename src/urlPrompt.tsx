import React, { ChangeEvent, FormEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

interface Props {
  busText: string;
  topicText: string;
  inputError: string | null;
  onPromptSubmit(a: FormEvent): void;
  setBusText(a: ChangeEvent<HTMLInputElement>): void;
  setTopicText(a: ChangeEvent<HTMLInputElement>): void;
}

const UrlPrompt = ({
  history,
  busText,
  inputError,
  topicText,
  setBusText,
  setTopicText,
  onPromptSubmit,
}: RouteComponentProps & Props) => (
  <>
    <h3>Ubikampus bluetooth visualizer</h3>
    <form id="urlPromptForm" onSubmit={onPromptSubmit}>
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
    <div>
      <button
        onClick={() => {
          history.push('/mockviz');
        }}
      >
        use mocked bluetooth beacons
      </button>
    </div>
    {inputError && <i id="inputError">{inputError}</i>}
  </>
);

export default withRouter(UrlPrompt);
