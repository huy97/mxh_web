import React from 'react';
import PropTypes from 'prop-types';
import { getTitle } from '.';
import ChatAvatar from './ChatAvatar';

const ChatInfo = props => {
    const {current} = props;
    return (
        <div className="chat-info">
            <div className="chat-info__user">
                <ChatAvatar conversation={current} lazy={false}/>
                <h2>{getTitle(current)}</h2>
            </div>
        </div>
    );
};

ChatInfo.propTypes = {
    current: PropTypes.object.isRequired
};

export default ChatInfo;