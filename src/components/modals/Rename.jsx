import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Formik } from 'formik';
import {
  Modal, FormControl, Form,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import useSocket from '../../hooks/index.js';
import { setError } from '../../features/errorsSlice.js';

const RenameModal = ({ onHide, modalInfo }) => {
  const dispatch = useDispatch();
  const contextSocket = useSocket();
  const i18n = useTranslation();
  const { channels } = useSelector((state) => state.channelsData);
  const validationSchema = yup.object().shape({
    body: yup.string().notOneOf(channels.map((channel) => channel.name)).trim().required(),
  });
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  });
  return (
    <Modal show={modalInfo.show} onHide={onHide} centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{i18n.t('modal.renameChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{
            body: modalInfo.item.name,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const renamingChannel = { ...modalInfo.item, name: values.body };
            contextSocket.promiseSocket('renameChannel', renamingChannel).catch((e) => dispatch(setError(e)));
            onHide();
          }}
        >
          {({
            values,
            isSubmitting,
            isValid,
            handleChange,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormControl
                onChange={handleChange}
                value={values.body}
                isInvalid={!isValid}
                data-testid="rename-channel"
                className="mb-2"
                name="body"
                ref={inputRef}
              />
              <Form.Control.Feedback type="invalid">{values.body.trim() !== '' ? i18n.t('errors.channelExist') : i18n.t('errors.required') }</Form.Control.Feedback>
              <div className="d-flex justify-content-end">
                <button type="button" disabled={isSubmitting} className="btn btn-secondary me-2" onClick={onHide}>
                  {i18n.t('cancel')}
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">{i18n.t('send')}</button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default RenameModal;