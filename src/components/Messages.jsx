import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { addNewMessage } from '../features/messagesSlice.js';

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
                <Button role="button" variant="outlined" disabled={!values.message} type="submit" className="btn-group-vertical">
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

export default ({ socket }) => (
  <div className="d-flex flex-column h-100">
    <MessagesHeader />
    <MessagesBox />
    <MessagesForm socket={socket} />
  </div>
);
