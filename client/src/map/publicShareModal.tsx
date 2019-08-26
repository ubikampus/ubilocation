import React from 'react';

import Modal, {
  ModalHeader,
  ModalParagraph,
  ModalButtonRow,
  UbiLogo,
} from '../common/modal';
import styled from 'styled-components';
import { PrimaryButton, SecondaryButton } from '../common/button';

interface Props {
  isOpen: boolean;
  onClose(): void;
  isPublic: boolean;
  nickname: string | null;
  publishLocation(a: boolean): void;
}

/*
// Fetch generated nickname from auth-server
const fetchNickname = async (): Promise<Nickname> => {
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
*/

const Nickname = styled.span`
  font-family: monospace;
`;

const MainRow = styled.div`
  display: flex;
`;

const PublicShareModal = ({
  isOpen,
  onClose,
  isPublic,
  nickname,
  publishLocation,
}: Props) => {
  /*
  useEffect(() => {
    const generateNick = async () => {
      const nick = await fetchNickname();

      setNickname(nick);
    };

    generateNick();
  }, []);
  */

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
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={e => publishLocation(e.target.checked)}
            />
            Share publicly
          </label>
          <ModalParagraph>
            {nickname === null ? (
              'nickname not set'
            ) : (
              <>
                using nickname <Nickname>{nickname}</Nickname>
              </>
            )}
          </ModalParagraph>
        </div>
      </MainRow>

      <ModalButtonRow>
        <PrimaryButton onClick={() => onClose()}>Ok</PrimaryButton>
      </ModalButtonRow>
    </Modal>
  );
};

export default PublicShareModal;
