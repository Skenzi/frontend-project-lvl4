import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { swapCurrentChannelId } from '../features/channelsSlice.js';

const ChannelsList = ({ showModal }) => {
  const dispatch = useDispatch();
  const i18n = useTranslation();
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
                {channel.name}
              </button>
              {channel.removable ? (
                <>
                  <button type="button" id="dLabel" className={`${classChannelActive} dropdown-toggle dropdown-toggle-split`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span className="sr-only">Toggle Dropdown</span></button>
                  <div className="dropdown-menu" aria-labelledby="dLabel">
                    <button type="button" className="dropdown-item" onClick={handleClickMenu('removing', channel)}>{i18n.t('remove')}</button>
                    <button type="button" className="dropdown-item" onClick={handleClickMenu('renaming', channel)}>{i18n.t('rename')}</button>
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

export default ({ showModal }) => {
  const i18n = useTranslation();
  return (
    <>
      <div className="d-flex justify-content-between mb-2 pl-4 pr-2">
        <span>{i18n.t('channels')}</span>
        <button type="button" role="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => showModal('adding')}>+</button>
      </div>
      <ChannelsList showModal={showModal} />
    </>
  );
};
