import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import useApp from '../../hooks/index.js';

const RemoveModal = ({ onHide, modalInfo }) => {
  const [error, setError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const appContext = useApp('appContext');
  const i18n = useTranslation();
  const handleRemove = () => {
    setIsSubmitting(true);
    appContext.socketApi('removeChannel', modalInfo.item)
      .then(() => {
        setError(null);
        onHide();
      })
      .catch(() => setError(i18n.t('errors.network')));
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
        {error ? <div className="text-danger">{error}</div> : null}
      </Modal.Body>
    </Modal>
  );
};

export default RemoveModal;
