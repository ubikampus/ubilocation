import React, { useState, FormEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import LoginPrompt from './loginPrompt';
import AuthServerService, { Admin } from './authServerService';

interface Props {
  setAdmin(a: Admin): void;
}

const LoginContainer = ({ history, setAdmin }: RouteComponentProps & Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const adminUser = await AuthServerService.login({
        username,
        password,
      });

      setAdmin(adminUser);
      window.localStorage.setItem(
        'loggedUbimapsAdmin',
        JSON.stringify(adminUser)
      );

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
