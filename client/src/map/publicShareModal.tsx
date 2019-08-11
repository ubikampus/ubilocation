import React, { useEffect, useState } from 'react';

import Modal, {
  ModalHeader,
  ModalParagraph,
  ModalButtonRow,
  UbiLogo,
} from '../common/modal';
import { SignedMessage } from '../admin/authApi';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '../common/button';

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
        <UbiLogo />
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
        <SecondaryButton onClick={() => onClose()}>Cancel</SecondaryButton>
        <PrimaryButton onClick={() => nickname && publishLocation(nickname)}>
          Ok
        </PrimaryButton>
      </ModalButtonRow>
    </Modal>
  );
};

export default PublicShareModal;
