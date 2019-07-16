import styled from 'styled-components';

const Button = styled.button`
  border: none;
  margin: 5px;
  border-radius: 5px;
  padding: 10px 25px;
  color: #595959;

  &:hover {
    color: #0c0c0c;
  }

  cursor: pointer;
  font-weight: 700;
  background-color: #e9e9e9;
  font-family: inherit;

  &[disabled] {
    opacity: 0.2;
    cursor: auto;
    color: inherit;
  }
`;

export default Button;
