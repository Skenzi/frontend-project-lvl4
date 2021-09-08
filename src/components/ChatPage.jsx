import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MyModal from '../modals/index.jsx';
import ChannelsContainer from './Channels.jsx';
import MessagesContainer from './Messages.jsx';
import {
  fetchContent,
} from '../features/channelsSlice';

const ChatPage = () => {
  const dispatch = useDispatch();
  console.log('ChatPAge');
  useEffect(() => {
    dispatch(fetchContent());
  }, []);
  const [modalInfo, setModalInfo] = useState({ type: null, item: null, show: false });
  const showModal = (type, item = null) => setModalInfo({ type, item, show: true });
  const hideModal = () => setModalInfo({ type: null, item: null, show: false });
  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow" aria-hidden={modalInfo.show}>
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <ChannelsContainer showModal={showModal} />
        </div>
        <div className="col p-0 h-100">
          <MessagesContainer />
        </div>
      </div>
      <MyModal onHide={hideModal} modalInfo={modalInfo} />
    </div>
  );
};

export default ChatPage;
