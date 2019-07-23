import React, { ChangeEvent, FormEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

interface Props {
  username: string;
  password: string;
  setUsername(e: ChangeEvent<HTMLInputElement>): void;
  setPassword(e: ChangeEvent<HTMLInputElement>): void;
  onSubmit(e: FormEvent): void;
}

const LoginPrompt = ({
  username,
  password,
  setUsername,
  setPassword,
  onSubmit,
}: RouteComponentProps & Props) => (
  <div>
    <h3>Admin Login</h3>
    <form onSubmit={onSubmit}>
      <p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={setUsername}
        />
      </p>
      <p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
        />
      </p>
      <p>
        <button type="submit">Log In</button>
      </p>
    </form>
    <p>
      <Link to="/">Go back to the map</Link>
    </p>
  </div>
);

export default withRouter(LoginPrompt);
