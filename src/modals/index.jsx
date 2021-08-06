import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addChannel, renameChannel, removeChannel } from '../features/channelsSlice';
import AddModal from './Add.jsx';
import RemoveModal from './Remove.jsx';
import RenameModal from './Rename.jsx';

const modals = {
  adding: AddModal,
  removing: RemoveModal,
  renaming: RenameModal,
};

const renderModal = ({socket, onHide, modalInfo}) => {
  const dispatch = useDispatch();
  const socketRef = useRef(socket);
  useEffect(() => {
    socketRef.current.on('newChannel', (newChannel) => {
      dispatch(addChannel(newChannel));
    });
    socketRef.current.on('removeChannel', (removedChannel) => {
      dispatch(removeChannel(removedChannel));
    });
    socketRef.current.on('renameChannel', (renamingChannel) => {
      dispatch(renameChannel(renamingChannel));
    });
  }, [socketRef]);
  if (!modalInfo.type) {
    return null;
  }
  const Component = modals[modalInfo.type];
  return <Component modalInfo={modalInfo} onHide={onHide} socket={socket} />;
}

export default renderModal;
