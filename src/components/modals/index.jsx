import React from 'react';
import { useSelector } from 'react-redux';
import { modalSelector } from '../../stateSelectors/selectors.js';
import AddModal from './Add.jsx';
import RemoveModal from './Remove.jsx';
import RenameModal from './Rename.jsx';

const modals = {
  adding: AddModal,
  removing: RemoveModal,
  renaming: RenameModal,
};

const renderModal = () => {
  const modalInfo = useSelector(modalSelector);
  if (!modalInfo.type) {
    return null;
  }
  const Component = modals[modalInfo.type];
  return <Component />;
};

export default renderModal;
