import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import MyModal from './modals/index.jsx';
import ChannelsContainer from './Channels.jsx';
import MessagesContainer from './Messages.jsx';
import {
  setChannels,
} from '../features/channelsSlice';
import { setMessages } from '../features/messagesSlice.js';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const ChatPage = () => {
  const i18n = useTranslation();
  const { error } = useSelector((state) => state.errors);
  const [modalInfo, setModalInfo] = useState({ type: null, item: null, show: false });
  const [stateContent, setStateContent] = useState('waiting');
  const showModal = (type, item = null) => setModalInfo({ type, item, show: true });
  const hideModal = () => setModalInfo({ type: null, item: null, show: false });
  const dispatch = useDispatch();
  useEffect(() => {
    const response = axios.get(routes.dataPath(), {
      headers: getAuthHeader(),
    });
    response.then(({ data }) => {
      dispatch(setChannels(data));
      dispatch(setMessages(data));
      setStateContent('loaded');
    })
      .catch((e) => {
        setStateContent('error');
        console.log(e);
      });
  }, []);
  return stateContent !== 'waiting' ? (
    <div className="container h-100 my-4 overflow-hidden rounded shadow" aria-hidden={modalInfo.show}>
      {error ? <div className="position-absolute top-0 start-50 translate-middle-x w-25 alert alert-danger">{error}</div> : null}
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
  ) : <div className="alert alert-primary text-center my-4 overflow-hidden rounded shadow">{i18n.t('load')}</div>;
};

export default ChatPage;
