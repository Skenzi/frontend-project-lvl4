import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import useSocket from '../../hooks/index.js';
import { setError } from '../../features/errorsSlice.js';

const RemoveModal = ({ onHide, modalInfo }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contextSocket = useSocket();
  const i18n = useTranslation();
  const handleRemove = () => {
    setIsSubmitting(true);
    contextSocket.promiseSocket('removeChannel', modalInfo.item)
      .catch((e) => dispatch(setError(e)));
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
          <button type="button" disabled={isSubmitting} className="btn btn-secondary me-2" onClick={onHide}>
            {i18n.t('cancel')}
          </button>
          <button type="button" disabled={isSubmitting} className="btn btn-danger" onClick={handleRemove}>{i18n.t('remove')}</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveModal;
