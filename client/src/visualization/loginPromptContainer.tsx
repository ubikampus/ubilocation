import React, { useState, FormEvent } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import LoginPrompt from './loginPrompt';
import AuthApi, { Admin } from './authApi';

interface Props {
  setAdmin(a: Admin): void;
}

const LoginContainer = ({ history, setAdmin }: RouteComponentProps & Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const adminUser = await AuthApi.login({
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
      setNotification('');
      history.push('/');
    } catch (exception) {
      setNotification('Invalid username or password');
      setTimeout(() => {
        setNotification('');
      }, 5000);
    }
  };

  return (
    <LoginPrompt
      username={username}
      password={password}
      setUsername={e => setUsername(e.currentTarget.value)}
      setPassword={e => setPassword(e.currentTarget.value)}
      notification={notification}
      onSubmit={onSubmit}
    />
  );
};

export default withRouter(LoginContainer);
