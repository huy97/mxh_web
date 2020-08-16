import React from 'react';
import PropTypes from 'prop-types';
import LoadImage from 'components/common/LoadImage';

const MessageItem = React.memo(props => {
    const {item, userInfos, currentUser} = props;

    const DrawAvatar = () => {
        const user = userInfos.find((obj) => obj._id === item.from);
        if(user) return (
            <div className="chat-container__message-item__avatar">
                <LoadImage src={user.avatar} alt={user.fullName}/>
            </div>
        )
        return null;
    }

    const isSender = () => {
        return item.from === currentUser.info._id ? 'sender': '';
    }

    return (
        <div className={`chat-container__message-item ${isSender()}`}>
            <DrawAvatar/>
            <div className="chat-container__message-item__content">
                <span>
                    {item.message}
                </span>
            </div>
        </div>
    );
});

MessageItem.propTypes = {
    item: PropTypes.object.isRequired,
    userInfos: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
};

export default MessageItem;