import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import MyModal from '../modals/index.jsx';
import ChannelsContainer from './Channels.jsx';
import MessagesContainer from './Messages.jsx';
import {
  fetchContent,
} from '../features/channelsSlice';

const ChatPage = () => {
  const [modalInfo, setModalInfo] = useState({ type: null, item: null, show: false });
  const [stateContent, setStateContent] = useState('waiting');
  const showModal = (type, item = null) => setModalInfo({ type, item, show: true });
  const hideModal = () => setModalInfo({ type: null, item: null, show: false });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchContent()).then(() => {
      setStateContent('loaded');
    }).catch(() => {
      setStateContent('error');
    });
  }, []);
  return stateContent === 'loaded' ? (
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
  ) : null;
};

export default ChatPage;
