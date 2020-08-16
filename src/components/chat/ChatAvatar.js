import React from 'react';
import PropTypes from 'prop-types';
import LoadImage from 'components/common/LoadImage';

const ChatAvatar = React.memo(props => {
    const {conversation, lazy} = props;
    const [first, last] = conversation.userInfos;
    const totalUsers = conversation.userInfos.length;

    const getAnyoneOnline = () => {
        let isOnline = false;
        conversation.userInfos.forEach((obj) => {
            if(obj.online) {
                isOnline = true;
                return false;
            }
        });
        return isOnline;
    }

    if(totalUsers === 1) return (
        <div className="chat-list__item-avatar">
            <LoadImage lazy={lazy} src={first.avatar} alt={first.fullName}/>
            {first.online ? <span className="chat-list__item-avatar__online"></span> : <span className="chat-list__item-avatar__offline"></span>}
        </div>
    )
    return (
        <div className="chat-list__item-avatar">
            <div className="chat-list__item-avatar__first">
                <LoadImage lazy={lazy} src={first.avatar} alt={first.fullName}/>
            </div>
            <div className="chat-list__item-avatar__last">
                <LoadImage lazy={lazy} src={last.avatar} alt={last.fullName}/>
            </div>
            {getAnyoneOnline() ? <span className="chat-list__item-avatar__online"></span> : <span className="chat-list__item-avatar__offline"></span>}
        </div>
    );
});

ChatAvatar.propTypes = {
    conversation: PropTypes.object.isRequired,
    lazy: PropTypes.bool
};

export default ChatAvatar;