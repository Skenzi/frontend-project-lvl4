import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Form, Modal, FormControl,
} from 'react-bootstrap';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useApi } from '../../hooks/index.js';

const AddModal = ({ onHide, modalInfo }) => {
  const [error, setError] = useState(null);
  const apiContext = useApi();
  const inputRef = useRef();
  const i18n = useTranslation();
  const { channels } = useSelector((state) => state.channelsData);
  const validationSchema = yup.object().shape({
    body: yup.string().notOneOf(channels.map((channel) => channel.name), i18n.t('errors.channelExist')).trim(i18n.t('errors.required')).required(),
  });
  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema,
    onSubmit: (values) => {
      apiContext.socketApi('newChannel', { name: values.body.trim() })
        .then(() => {
          setError(null);
          onHide();
        })
        .catch((e) => {
          if (e.response.status === 408) {
            setError(i18n.t('errors.timeout'));
          } else {
            setError(i18n.t('errors.network'));
          }
          formik.setSubmitting(false);
        });
    },
  });
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <Modal show={modalInfo.show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{i18n.t('modal.addChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <FormControl
            onChange={formik.handleChange}
            value={formik.values.body}
            isInvalid={!formik.isValid || error}
            data-testid="add-channel"
            name="body"
            ref={inputRef}
            className="mb-2"
          />
          <Form.Control.Feedback type="invalid">{error || formik.errors.body}</Form.Control.Feedback>
          <div className="d-flex justify-content-end">
            <button type="button" disabled={formik.isSubmitting} className="btn btn-secondary me-2" onClick={onHide}>
              {i18n.t('cancel')}
            </button>
            <button type="submit" disabled={formik.isSubmitting} className="btn btn-primary">
              {i18n.t('send')}
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModal;
