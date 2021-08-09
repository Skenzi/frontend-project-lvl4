import React, { useEffect, useRef } from 'react';
import { Formik } from 'formik';
import {
  Form, Modal, FormGroup, FormControl,
} from 'react-bootstrap';
import * as yup from 'yup';

import { useSelector } from 'react-redux';

const AddModal = ({ onHide, socket, modalInfo }) => {
  const inputRef = useRef();
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
        <Modal.Title>Add channel</Modal.Title>
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
                  data-testid="input-body"
                  name="body"
                  ref={inputRef}
                />
                {errors.body && touched.body ? (<p className="text-danger">Канал с таким именем уже существует</p>) : null}
              </FormGroup>
              <input type="submit" className="btn btn-primary" value="submit" />
              <Form.Control.Feedback type="invalid">Already exist</Form.Control.Feedback>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddModal;
