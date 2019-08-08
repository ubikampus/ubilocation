import styled from 'styled-components';

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

export const SecondaryButton = styled(Button)`
  background: #f3f6f7;
`;

export const PrimaryButton = styled(Button)`
  background: #4287f5;
  color: white;

  &&:hover {
    color: #eee;
  }
`;

export default Button;

export const MapboxButton = styled.div`
  && {
    display: inline-block;
  }

  position: absolute;
  bottom: 50px;
  right: 10px;
  z-index: 1000;
`;
