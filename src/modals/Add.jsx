import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import {
  Form, Modal, FormGroup, FormControl,
} from 'react-bootstrap';
import * as yup from 'yup';
import { useSelector } from 'react-redux';

const AddModal = ({ onHide, socket, modalInfo }) => {
  const inputRef = useRef();
  const i18n = useTranslation();
  const { channels } = useSelector((state) => state.channelsData);
  const validationSchema = yup.object().shape({
    body: yup.string().notOneOf(channels.map((channel) => channel.name)),
  });
  useEffect(() => {
    inputRef.current.focus();
  });
  return (
    <Modal show={modalInfo.show} onHide={onHide}>
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
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <FormControl
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.body}
                  data-testid="add-channel"
                  name="body"
                  ref={inputRef}
                />
              </FormGroup>
              {errors.body && touched.body ? (<p className="text-danger">{i18n.t('errors.channelExist')}</p>) : null}
              <button type="submit" role="button" className="btn btn-primary" value="submit">
                {i18n.t('send')}
              </button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddModal;
