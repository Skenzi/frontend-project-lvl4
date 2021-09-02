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
    <Modal show={modalInfo.show} onHide={onHide} centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{i18n.t('modal.removeChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">{i18n.t('youSure')}</p>
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-secondary me-2" onClick={onHide}>
            {i18n.t('cancel')}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleRemove}>{i18n.t('remove')}</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveModal;
