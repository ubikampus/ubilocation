import styled from 'styled-components';

// TODO: move to common

const Button = styled.button`
  border: none;
  margin: 5px;
  border-radius: 5px;
  padding: 10px 25px;
  color: #595959;

  cursor: pointer;
  font-weight: 700;
  background-color: #e9e9e9;
  font-family: inherit;

  &[disabled] {
    opacity: 0.2;
    cursor: auto;
  }

  &:not([disabled]):hover {
    color: #0c0c0c;
  }
`;

export default Button;
