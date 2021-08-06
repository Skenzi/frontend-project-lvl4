import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';

const AddModal = ({ onHide, socket, modalInfo }) => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  })
  const f = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: (values) => {
      socket.emit('newChannel', { name: values.body })
      onHide();
    },
  });
  return (
    <Modal show={modalInfo.show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={f.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.body}
              data-testid="input-body"
              name="body"
              ref={inputRef}
            />
          </FormGroup>
          <input type="submit" className="btn btn-primary" value="submit" />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddModal;
