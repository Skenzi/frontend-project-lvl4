import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import {
  Form, Modal, FormControl,
} from 'react-bootstrap';
import * as yup from 'yup';
import { useSelector } from 'react-redux';

const AddModal = ({ onHide, socket, modalInfo }) => {
  const inputRef = useRef();
  const i18n = useTranslation();
  const { channels } = useSelector((state) => state.channelsData);
  const validationSchema = yup.object().shape({
    body: yup.string().notOneOf(channels.map((channel) => channel.name)).trim().required(),
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
          onSubmit={async (values) => {
            try {
              socket.emit('newChannel', { name: values.body });
              onHide();
            } catch (e) {
              console.log(e);
            }
          }}
        >
          {({
            values,
            isValid,
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
              <Form.Control.Feedback type="invalid">{values.body.trim() !== '' ? i18n.t('errors.channelExist') : i18n.t('errors.required') }</Form.Control.Feedback>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onHide}>
                  {i18n.t('cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
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
