import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Formik } from 'formik';
import {
  Modal, FormGroup, FormControl, Form,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';

const RenameModal = ({ onHide, modalInfo, socket }) => {
  const i18n = useTranslation();
  const { channels } = useSelector((state) => state.channelsData);
  const validationSchema = yup.object().shape({
    body: yup.string().notOneOf(channels.map((channel) => channel.name)),
  });
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  });
  return (
    <Modal show={modalInfo.show} onHide={onHide}>
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
            socket.emit('renameChannel', renamingChannel);
            onHide();
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
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.body}
                  data-testid="rename-channel"
                  name="body"
                  ref={inputRef}
                />
              </FormGroup>
              {errors.body && touched.body ? (<p className="text-danger">{i18n.t('errors.channelExist')}</p>) : null}
              <button type="submit" role="button" className="btn btn-primary">{i18n.t('send')}</button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default RenameModal;
