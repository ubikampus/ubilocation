import React, { ChangeEvent, FormEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

/**
 * Credit: The CSS styles on this page are based on
 * (1) https://colorlib.com/wp/template/creative-login-form/
 * (2) the WordPress login form.
 */
const Background = styled.div`
  width: 100%;
  height: 100%;
  background: #f2f2f2;
`;

const LoginPage = styled.div`
  margin: auto;
  width: 320px;
  padding: 45px 0;
  text-align: center;
`;

const LoginHeader = styled.h1`
  font-size: 24px;
`;

const LoginForm = styled.form`
  padding: 26px 24px 26px;
  margin: 15px 0 20px;
  background: white;
  max-width: 320px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.13);
`;

const FormInput = styled.input`
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  margin: 0 0 10px;
  font-size: 14px;
  background: #fbfbfb;
  border: 1px solid #ddd;
`;

const FormButton = styled.button`
  width: 100%;
  padding: 10px;
  border: 0;
  font-size: 14px;
  color: white;
  background: #5599ff;
  &:hover {
    background: #2a7fff;
  }
`;

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
  <Background>
    <LoginPage>
      <LoginHeader>Admin Login</LoginHeader>
      <LoginForm onSubmit={onSubmit}>
        <FormInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={setUsername}
        />
        <FormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
        />
        <FormButton type="submit">Log In</FormButton>
      </LoginForm>
      <p>
        <Link to="/">&larr; Back to the map</Link>
      </p>
    </LoginPage>
  </Background>
);

export default withRouter(LoginPrompt);
