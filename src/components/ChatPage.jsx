import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { fetchContent, swapCurrentChannelId } from '../features/channelsSlice.js';
import { addNewMessage } from '../features/messagesSlice.js';
import MyModal from '../modals/index.jsx';

const ChannelsList = ({ showModal }) => {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channelsData);
  const handleClickMenu = (type, channel) => () => {
    showModal(type, channel);
  };
  return (
    <ul id="channelsList" className="nav flex-column nav-pills nav-fill px-2">
      {channels.map((channel) => {
        const classChannelActive = channel.id === currentChannelId ? 'btn btn-secondary' : 'btn';
        return (
          <li key={channel.id} className="nav-item w-100">
            <div className="d-flex dropdown btn-group">
              <button
                type="button"
                className={`${classChannelActive} w-100 rounded-0 text-left text-truncate`}
                onClick={() => {
                  dispatch(swapCurrentChannelId(channel.id));
                }}
              >
                #
                {' '}
                {channel.name}
              </button>
              {channel.removable ? (
                <>
                  <button type="button" id="dLabel" className={`${classChannelActive} dropdown-toggle dropdown-toggle-split`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span className="sr-only">Toggle Dropdown</span></button>
                  <div className="dropdown-menu" aria-labelledby="dLabel">
                    <button type="button" className="dropdown-item" onClick={handleClickMenu('removing', channel)}>Remove</button>
                    <button type="button" className="dropdown-item" onClick={handleClickMenu('renaming', channel)}>Rename</button>
                  </div>
                </>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const ChannelsContainer = ({ showModal }) => {
  const i18n = useTranslation();
  return (
    <>
      <div className="d-flex justify-content-between mb-2 pl-4 pr-2">
        <span>{i18n.t('channels')}</span>
        <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => showModal('adding')}>+</button>
      </div>
      <ChannelsList showModal={showModal} />
    </>
  );
};

const MessagesHeader = () => {
  const i18n = useTranslation();
  const { currentChannelId, channels } = useSelector((state) => state.channelsData);
  const { messages } = useSelector((state) => state.messagesData);
  const currentMessages = messages.filter((message) => message.channelId === currentChannelId);
  const currentChannel = channels.find(({ id }) => currentChannelId === id);
  const messagesCount = currentMessages.length;
  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        <b>
          #
          {currentChannel && currentChannel.name}
        </b>
      </p>
      <p className="text-muted">{`${messagesCount} ${i18n.t('messages')}`}</p>
    </div>
  );
};

const MessagesBox = () => {
  const { currentChannelId } = useSelector((state) => state.channelsData);
  const { messages } = useSelector((state) => state.messagesData);
  const currentMessages = messages.filter((message) => message.channelId === currentChannelId);
  return (
    <div className="chat-messages overflow-auto px-5 " id="messages-box">
      {currentMessages.map(({ text, username, id }) => (
        <div className="text-break mb-2" key={id}>
          <b>{username}</b>
          {': '}
          {text}
        </div>
      ))}
    </div>
  );
};

const MessagesForm = ({ socket }) => {
  const { currentChannelId } = useSelector((state) => state.channelsData);
  const i18n = useTranslation();
  const username = localStorage.getItem('username');
  const socketRef = useRef(socket);
  const dispatch = useDispatch();
  useEffect(() => {
    socketRef.current.on('newMessage', (newMessage) => {
      dispatch(addNewMessage(newMessage));
    });
  }, [socketRef]);
  return (
    <div className="mt-auto px-5 py-3">
      <Formik
        initialValues={{ message: '' }}
        onSubmit={({ message }, actions) => {
          actions.resetForm();
          const currentMessage = { username, text: message, channelId: currentChannelId };
          socket.emit('newMessage', currentMessage);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit} className="py-1 border rounded-2">
            <div className="input-group has-validation">
              <Form.Control
                type="text"
                name="message"
                data-testid="new-message"
                id="message"
                placeholder={i18n.t('inputMessagePlaceholder')}
                className="border-0 p-0 pl-2 form-control"
                onChange={handleChange}
                value={values.message}
              />
              <div className="input-group-append">
                <Button variant="outlined" disabled={!values.message} type="submit" className="btn-group-vertical">
                  <span>{i18n.t('send')}</span>
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const MessagesContainer = ({ socket }) => (
  <div className="d-flex flex-column h-100">
    <MessagesHeader />
    <MessagesBox />
    <MessagesForm socket={socket} />
  </div>
);

const ChatPage = ({ socket }) => {
  const [modalInfo, setModalInfo] = useState({ type: null, item: null, show: false });
  const showModal = (type, item = null) => setModalInfo({ type, item, show: true });
  const hideModal = () => setModalInfo({ type: null, item: null, show: false });
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('test1');
    dispatch(fetchContent());
  }, []);
  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <div className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
          <ChannelsContainer showModal={showModal} />
        </div>
        <div className="col p-0 h-100">
          <MessagesContainer socket={socket} />
        </div>
      </div>
      <MyModal socket={socket} onHide={hideModal} modalInfo={modalInfo} />
    </div>
  );
};

/*
import { io } from "socket.io-client";

const socket = io({
  reconnection: false
});

const tryReconnect = () => {
  setTimeout(() => {
    socket.io.open((err) => {
      if (err) {
        tryReconnect();
      }
    });
  }, 2000);
}

socket.io.on("close", tryReconnect);
*/

export default ChatPage;
