import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';

const RemoveModal = ({ onHide, modalInfo, socket }) => {
  const i18n = useTranslation();
  const handleRemove = () => {
    socket.emit('removeChannel', modalInfo.item);
    onHide();
  };
  return (
    <Modal show={modalInfo.show} onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{i18n.t('modal.removeChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {i18n.t('youSure')}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" role="button" className="btn btn-danger" onClick={handleRemove}>{i18n.t('remove')}</button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveModal;
