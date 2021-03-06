import React from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChannelId } from '../slices/channelsSlice.js';
import { channelsSelector, channelIdSelector } from '../stateSelectors/selectors.js';
import { setModal } from '../slices/modalsSlice.js';

const ButtonChannel = ({ classChannelActive, channel }) => {
  const dispatch = useDispatch();
  return (
    <Button
      type="button"
      variant={classChannelActive}
      className="w-100 rounded-0 text-start text-truncate"
      onClick={() => {
        dispatch(setCurrentChannelId(channel.id));
      }}
    >
      <span className="me-1">#</span>
      {channel.name}
    </Button>
  );
};

const ChannelsList = () => {
  const i18n = useTranslation();
  const dispatch = useDispatch();
  const channels = useSelector(channelsSelector);
  const currentChannelId = useSelector(channelIdSelector);
  const handleClickMenu = (type, item) => () => {
    dispatch(setModal({ type, item }));
  };
  return (
    <ul className="nav flex-column nav-pills nav-fill px-2">
      {channels.map((channel) => {
        const classChannelActive = channel.id === currentChannelId ? 'secondary' : '';
        return (
          <li key={channel.id} className="nav-item w-100">
            {channel.removable ? (
              <Dropdown as={ButtonGroup} className="d-flex">
                <ButtonChannel classChannelActive={classChannelActive} channel={channel} />
                <Dropdown.Toggle variant={classChannelActive} split className="flex-grow-0" />
                <Dropdown.Menu>
                  <Dropdown.Item href="#" onClick={handleClickMenu('removing', channel)}>{i18n.t('remove')}</Dropdown.Item>
                  <Dropdown.Item href="#" onClick={handleClickMenu('renaming', channel)}>{i18n.t('rename')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <ButtonChannel classChannelActive={classChannelActive} channel={channel} />
            )}
          </li>
        );
      })}
    </ul>
  );
};

const ChannelsContainer = () => {
  const i18n = useTranslation();
  const dispatch = useDispatch();
  return (
    <>
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{i18n.t('channels')}</span>
        <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => dispatch(setModal({ type: 'adding' }))}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ChannelsList />
    </>
  );
};

export default ChannelsContainer;
