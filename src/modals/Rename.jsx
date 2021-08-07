import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { renameChannel } from '../features/channelsSlice.js';

const RenameModal = ({ onHide, modalInfo, socket }) => {
  const dispatch = useDispatch();
  const socketRef = useRef(socket);
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
    socketRef.current.on('renameChannel', (renamingChannel) => {
      dispatch(renameChannel(renamingChannel));
    });
  }, [socketRef]);
  const f = useFormik({
    initialValues: {
      body: modalInfo.item.name,
    },
    onSubmit: (values) => {
      const renamingChannel = { ...modalInfo.item, name: values.body };
      socket.emit('renameChannel', renamingChannel);
      onHide();
    },
  });
  return (
    <Modal show={modalInfo.show} onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Rename</Modal.Title>
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
          <input type="submit" className="btn btn-primary" value="Submit" />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameModal;
