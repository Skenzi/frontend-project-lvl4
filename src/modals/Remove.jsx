import React, { useRef, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { removeChannel } from '../features/channelsSlice';

const RemoveModal = ({ onHide, modalInfo, socket }) => {
  const dispatch = useDispatch();
  const removeModalRef = useRef(socket);
  useEffect(() => {
    removeModalRef.current.on('removeChannel', (removedChannel) => {
      dispatch(removeChannel(removedChannel));
    });
  }, [removeModalRef]);
  const handleRemove = () => {
    socket.emit('removeChannel', modalInfo.item);
    onHide();
  };
  return (
    <Modal show={modalInfo.show} onHide={onHide}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Remove</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <button type="button" className="btn btn-danger" onClick={handleRemove}>Remove</button>
      </Modal.Body>
    </Modal>
  );
};

export default RemoveModal;
