import React from 'react';
import AddModal from './Add.jsx';
import RemoveModal from './Remove.jsx';
import RenameModal from './Rename.jsx';

const modals = {
  adding: AddModal,
  removing: RemoveModal,
  renaming: RenameModal,
};

const renderModal = ({ promiseSocket, onHide, modalInfo }) => {
  if (!modalInfo.type) {
    return null;
  }
  const Component = modals[modalInfo.type];
  return <Component modalInfo={modalInfo} onHide={onHide} promiseSocket={promiseSocket} />;
};

export default renderModal;
