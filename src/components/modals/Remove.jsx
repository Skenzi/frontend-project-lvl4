import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useApi } from '../../hooks/index.js';
import { modalSelector } from '../../stateSelectors/selectors.js';
import { hideModal } from '../../slices/modalsSlice.js';

const RemoveModal = () => {
  const [error, setError] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiContext = useApi();
  const dispatch = useDispatch();
  const i18n = useTranslation();
  const modalInfo = useSelector(modalSelector);

  const handleRemove = () => {
    setIsSubmitting(true);
    apiContext.socketApi('removeChannel', modalInfo.item)
      .then(() => {
        setError(null);
        dispatch(hideModal());
      })
      .catch((e) => {
        setIsSubmitting(false);
        if (e.response.status === 408) {
          setError(i18n.t('errors.timeout'));
        } else {
          setError(i18n.t('errors.network'));
        }
      });
  };
  return (
    <Modal show={modalInfo.show} onHide={() => dispatch(hideModal())} centered>
      <Modal.Header closeButton onHide={() => dispatch(hideModal())}>
        <Modal.Title>{i18n.t('modal.removeChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">{i18n.t('youSure')}</p>
        <div className="d-flex justify-content-end">
          <button type="button" disabled={isSubmitting} className="btn btn-secondary me-2" onClick={() => dispatch(hideModal())}>
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
