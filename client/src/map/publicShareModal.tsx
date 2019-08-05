import React, { useEffect, useState } from 'react';

import Modal, {
  ModalHeader,
  ModalParagraph,
  ModalButtonRow,
} from '../common/modal';
import { SignedMessage } from '../admin/authApi';
import styled from 'styled-components';
import Button from '../common/button';
import ubiukko from './ubi_ukko.png';

type Nickname = string;

interface Props {
  isOpen: boolean;
  onClose(): void;
  publishLocation(message: SignedMessage<Nickname>): void;
}

/**
 * TODO: implement
 *
 * Fetch generated nickname from auth-server
 */
const fetchNickname = async (): Promise<SignedMessage<Nickname>> => {
  // axios.get('/nickname') . . .
  return {
    payload: 'random-nick-12',
    signatures: [
      {
        protected: '123',
        signature: '123',
      },
    ],
  };
};

const Nickname = styled.span`
  font-family: monospace;
`;

const UbiLogo = styled.img`
  height: 70px;
  align-self: center;
  margin-right: 25px;
  margin-left: 10px;
`;

const MainRow = styled.div`
  display: flex;
`;

const PublicShareModal = ({ isOpen, onClose, publishLocation }: Props) => {
  const [nickname, setNickname] = useState<SignedMessage<Nickname> | null>(
    null
  );

  useEffect(() => {
    const generateNick = async () => {
      const nick = await fetchNickname();

      setNickname(nick);
    };

    generateNick();
  }, []);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <MainRow>
        <UbiLogo src={ubiukko} />
        <div>
          <ModalHeader>Share location for all users</ModalHeader>
          <ModalParagraph>
            Display your current position on Ubikampus info screen and for other
            Ubilocation users. Generated nickname will be shown on map.
          </ModalParagraph>
          <ModalParagraph>
            {nickname === null ? (
              'loading...'
            ) : (
              <>
                using nickname <Nickname>{nickname.payload}</Nickname>
              </>
            )}
          </ModalParagraph>
        </div>
      </MainRow>

      <ModalButtonRow>
        <Button onClick={() => nickname && publishLocation(nickname)}>
          Ok
        </Button>
        <Button onClick={() => onClose()}>Cancel</Button>
      </ModalButtonRow>
    </Modal>
  );
};

export default PublicShareModal;
