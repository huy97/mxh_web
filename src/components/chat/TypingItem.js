import React from 'react';
import PropTypes from 'prop-types';
import LoadImage from 'components/common/LoadImage';

const TypingItem = React.memo(props => {
    const {id, userInfos} = props;

    const DrawAvatar = () => {
        const user = userInfos.find((obj) => obj._id === id);
        if(user) return (
            <div className="chat-container__message-item__avatar">
                <LoadImage src={user.avatar} alt={user.fullName}/>
            </div>
        )
        return null;
    }

    return (
        <div className={`chat-container__message-typing`}>
            <DrawAvatar/>
            <div className="chat-container__message-typing__content">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
});

TypingItem.propTypes = {
    id: PropTypes.string.isRequired,
    userInfos: PropTypes.array.isRequired
};

export default TypingItem;