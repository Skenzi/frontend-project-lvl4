import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { removeChannel } from '../features/channelsSlice';

const RemoveModal = ({ onHide, modalInfo, socket }) => {
  const dispatch = useDispatch();
  const i18n = useTranslation();
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
        <Modal.Title>{i18n.t('modal.removeChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {i18n.t('youSure')}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-danger" onClick={handleRemove}>{i18n.t('remove')}</button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveModal;
