import React from 'react';
import QRcode from 'qrcode.react';

import styled from 'styled-components';
import Modal from '../common/modal';

interface Props {
  modalIsOpen: boolean;
  closeModal(): void;
  modalText: string;
}

const QrRow = styled.div`
  display: flex;
  justify-content: center;
`;

const PaddedQrCode = styled(QRcode)`
  margin: 20px;
`;

const QRcodeLink = styled.a`
  word-break: break-all;
`;

const QrCodeModal = ({ modalIsOpen, closeModal, modalText }: Props) => (
  <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    contentLabel="QR-code"
  >
    <QRcodeLink href={modalText}>{modalText}</QRcodeLink>
    <QrRow>
      <PaddedQrCode value={modalText} size={256} />
    </QrRow>
  </Modal>
);

export default QrCodeModal;
