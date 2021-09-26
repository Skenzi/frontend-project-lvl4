import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import MyModal from './modals/index.jsx';
import ChannelsContainer from './Channels.jsx';
import MessagesContainer from './Messages.jsx';
import { setChannels } from '../slices/channelsSlice';
import { setMessages } from '../slices/messagesSlice.js';
import routes from '../routes.js';
import { useAuth } from '../hooks/index.js';

const ChatPage = () => {
  const apiContext = useAuth();
  const i18n = useTranslation();
  const [error, setError] = useState();
  const [modalInfo, setModalInfo] = useState({ type: null, item: null, show: false });
  const [stateContent, setStateContent] = useState('waiting');
  const showModal = (type, item = null) => setModalInfo({ type, item, show: true });
  const hideModal = () => setModalInfo({ type: null, item: null, show: false });
  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    const response = axios.get(routes.dataPath(), {
      headers: apiContext.userRequestOptions,
    });
    response.then(({ data }) => {
      dispatch(setChannels(data));
      dispatch(setMessages(data));
      setStateContent('loaded');
    })
      .catch((e) => {
        if (e.response.status === 401) {
          history.replace({ pathname: '/login' });
        }
        setStateContent('error');
        setError(i18n.t('errors.network'));
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
