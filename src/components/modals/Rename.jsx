import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useFormik } from 'formik';
import {
  Modal, FormControl, Form,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '../../hooks/index.js';
import { channelsNamesSelector, modalSelector } from '../../stateSelectors/selectors.js';
import { hideModal } from '../../slices/modalsSlice.js';

const RenameModal = () => {
  const [error, setError] = useState();
  const modalInfo = useSelector(modalSelector);
  const dispatch = useDispatch();
  const apiContext = useApi();
  const i18n = useTranslation();
  const channelsNames = useSelector(channelsNamesSelector);
  const validationSchema = yup.object().shape({
    body: yup.string().notOneOf(channelsNames, i18n.t('errors.channelExist')).trim(i18n.t('errors.required')).required(),
  });
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      body: modalInfo.item.name,
    },
    validationSchema,
    onSubmit: (values) => {
      const renamingChannel = { ...modalInfo.item, name: values.body };
      apiContext.socketApi('renameChannel', renamingChannel)
        .then(() => {
          setError(null);
          dispatch(hideModal());
        })
        .catch((e) => {
          formik.setSubmitting(false);
          if (e.response.status === 408) {
            setError(i18n.t('errors.timeout'));
          } else {
            setError(i18n.t('errors.network'));
          }
        });
    },
  });
  return (
    <Modal show={modalInfo.show} onHide={() => dispatch(hideModal())} centered>
      <Modal.Header closeButton onHide={() => dispatch(hideModal())}>
        <Modal.Title>{i18n.t('modal.renameChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormControl
            onChange={formik.handleChange}
            value={formik.values.body}
            isInvalid={!formik.isValid || error}
            data-testid="rename-channel"
            className="mb-2"
            name="body"
            ref={inputRef}
          />
          <Form.Control.Feedback type="invalid">{error || formik.errors.body}</Form.Control.Feedback>
          <div className="d-flex justify-content-end">
            <button type="button" disabled={formik.isSubmitting} className="btn btn-secondary me-2" onClick={() => dispatch(hideModal())}>
              {i18n.t('cancel')}
            </button>
            <button type="submit" disabled={formik.isSubmitting} className="btn btn-primary">{i18n.t('send')}</button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameModal;
