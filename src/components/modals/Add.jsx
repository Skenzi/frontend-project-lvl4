import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import {
  Form, Modal, FormControl,
} from 'react-bootstrap';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import useApp from '../../hooks/index.js';

const AddModal = ({ onHide, modalInfo }) => {
  const [error, setError] = useState(null);
  const appContext = useApp('appContext');
  const inputRef = useRef();
  const i18n = useTranslation();
  const { channels } = useSelector((state) => state.channelsData);
  const validationSchema = yup.object().shape({
    body: yup.string().notOneOf(channels.map((channel) => channel.name), i18n.t('errors.channelExist')).trim(i18n.t('errors.required')).required(),
  });
  useEffect(() => {
    inputRef.current.focus();
  });
  return (
    <Modal show={modalInfo.show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{i18n.t('modal.addChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{
            body: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            appContext.socketApi('newChannel', { name: values.body.trim() })
              .then(() => {
                setError(null);
                onHide();
              })
              .catch(() => setError(i18n.t('errors.errorNetwork')));
          }}
        >
          {({
            values,
            isValid,
            errors,
            isSubmitting,
            handleChange,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormControl
                onChange={handleChange}
                value={values.body}
                isInvalid={!isValid}
                data-testid="add-channel"
                name="body"
                ref={inputRef}
                className="mb-2"
              />
              <Form.Control.Feedback type="invalid">{error || errors.body}</Form.Control.Feedback>
              <div className="d-flex justify-content-end">
                <button type="button" disabled={isSubmitting} className="btn btn-secondary me-2" onClick={onHide}>
                  {i18n.t('cancel')}
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {i18n.t('send')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddModal;
