import React, { useState, FormEvent } from 'react';
import { RouteComponentProps, withRouter, Redirect } from 'react-router';
import LoginPrompt from './loginPrompt';
import AuthApi, { Admin } from './authApi';
import TokenStore, { ADMIN_STORE_ID } from '../common/tokenStore';

interface Props {
  admin: Admin | null;
  setAdmin(a: Admin): void;
}

const LoginContainer = ({
  history,
  admin,
  setAdmin,
}: RouteComponentProps & Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const adminToken = await AuthApi.login({
        username,
        password,
      });

      setAdmin(adminToken);
      const adminTokenStore = new TokenStore<Admin>(ADMIN_STORE_ID);
      adminTokenStore.set(adminToken);

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

  if (admin) {
    return <Redirect to="/" />;
  }

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
