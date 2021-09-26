import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { animateScroll as scroll, Element as ScrollProvider } from 'react-scroll';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import { useApi, useAuth } from '../hooks/index.js';
import messagesSelector from '../stateSelectors/messagesSelectors.js';
import channelsSelector from '../stateSelectors/channelsSelectors.js';

const MessagesHeader = () => {
  const i18n = useTranslation();
  const { currentChannelId, channels } = useSelector(channelsSelector);
  const messages = useSelector(messagesSelector);
  const currentChannel = channels.find(({ id }) => currentChannelId === id);
  const messagesCount = messages.length;
  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        <b>
          {`# ${currentChannel && currentChannel.name}`}
        </b>
      </p>
      <p className="text-muted">{i18n.t('messages.message', { count: messagesCount })}</p>
    </div>
  );
};

const MessagesBox = () => {
  const messages = useSelector(messagesSelector);
  useEffect(() => {
    scroll.scrollToBottom({ containerId: 'messages-container' });
  }, [messages]);
  return (
    <ScrollProvider className="chat-messages overflow-auto px-5" id="messages-container">
      <div className="chat-messages overflow-auto px-5" id="messages-box">
        {messages.map(({ text, username, id }) => (
          <div className="text-break mb-2" key={id}>
            <b>{username}</b>
            {': '}
            {text}
          </div>
        ))}
      </div>
    </ScrollProvider>
  );
};

const MessagesForm = () => {
  const [error, setError] = useState();
  const messageInput = useRef();
  const apiContext = useApi();
  const auth = useAuth();
  const { currentChannelId } = useSelector(channelsSelector);

  useEffect(() => {
    messageInput.current.focus();
  }, [currentChannelId]);

  const i18n = useTranslation();

  const { username } = auth.userId;

  const formik = useFormik({
    initialValues: { message: '' },
    onSubmit: ({ message }, actions) => {
      const currentMessage = { username, text: message, channelId: currentChannelId };
      apiContext.socketApi('newMessage', currentMessage)
        .then(() => actions.resetForm())
        .catch((e) => {
          if (e.response.status === 408) {
            setError(i18n.t('errors.timeout'));
          } else {
            setError(i18n.t('errors.network'));
          }
        });
    },
  });
  return (
    <div className="mt-auto px-5 py-3">
      <Form onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
        <div className="input-group has-validation">
          <Form.Control
            type="text"
            name="message"
            ref={messageInput}
            data-testid="new-message"
            placeholder={i18n.t('inputMessagePlaceholder')}
            className="border-0 p-0 ps-2"
            onChange={formik.handleChange}
            value={formik.values.message}
          />
          <div className="input-group-append">
            <button disabled={!formik.values.message} type="submit" className="btn btn-group-vertical">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" /></svg>
              <span className="visually-hidden">{i18n.t('send')}</span>
            </button>
          </div>
        </div>
      </Form>
      {error ? <div className="text-danger">{error}</div> : null}
    </div>
  );
};

const MessagesContainer = ({ promiseSocket }) => (
  <div className="d-flex flex-column h-100">
    <MessagesHeader />
    <MessagesBox />
    <MessagesForm promiseSocket={promiseSocket} />
  </div>
);

export default MessagesContainer;
