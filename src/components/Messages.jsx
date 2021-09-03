import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';

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
          {`# ${currentChannel && currentChannel.name}`}
        </b>
      </p>
      <p className="text-muted">{i18n.t('messages.message', { count: messagesCount })}</p>
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
  return (
    <div className="mt-auto px-5 py-3">
      <Formik
        initialValues={{ message: '' }}
        onSubmit={async ({ message }, actions) => {
          try {
            const currentMessage = { username, text: message, channelId: currentChannelId };
            socket.emit('newMessage', currentMessage);
            actions.resetForm();
          } catch (e) {
            console.log(e);
          }
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
                placeholder={i18n.t('inputMessagePlaceholder')}
                className="border-0 p-0 ps-2"
                onChange={handleChange}
                value={values.message}
              />
              <div className="input-group-append">
                <button disabled={!values.message} type="submit" className="btn btn-group-vertical">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" /></svg>
                  <span className="visually-hidden">Отправить</span>
                </button>
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
