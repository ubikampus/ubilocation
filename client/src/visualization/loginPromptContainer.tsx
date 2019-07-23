import React, { useState, FormEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import LoginPrompt from './loginPrompt';
import loginService from './loginService';

interface Props {
  setIsAdmin(a: boolean): void;
}

const LoginContainer = ({
  history,
  setIsAdmin,
}: RouteComponentProps & Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await loginService.login({
        username,
        password,
      });

      // TODO: Replace with setUser(newUser);
      setIsAdmin(true);
      setUsername('');
      setPassword('');
      history.push('/');
    } catch (exception) {
      // TODO: setErrorMessage...
    }
  };

  return (
    <LoginPrompt
      username={username}
      password={password}
      setUsername={e => setUsername(e.currentTarget.value)}
      setPassword={e => setPassword(e.currentTarget.value)}
      onSubmit={onSubmit}
    />
  );
};

export default withRouter(LoginContainer);
