import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useFormik } from 'formik';
import {
  Modal, FormControl, Form,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useApi } from '../../hooks/index.js';

const RenameModal = ({ onHide, modalInfo }) => {
  const [error, setError] = useState();
  const apiContext = useApi();
  const i18n = useTranslation();
  const { channels } = useSelector((state) => state.channelsData);
  const validationSchema = yup.object().shape({
    body: yup.string().notOneOf(channels.map((channel) => channel.name), i18n.t('errors.channelExist')).trim(i18n.t('errors.required')).required(),
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
          onHide();
        })
        .catch(() => {
          formik.setSubmitting(false);
          setError(i18n.t('errors.network'));
        });
    },
  });
  return (
    <Modal show={modalInfo.show} onHide={onHide} centered>
      <Modal.Header closeButton onHide={onHide}>
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
            <button type="button" disabled={formik.isSubmitting} className="btn btn-secondary me-2" onClick={onHide}>
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
