import React, { Fragment} from 'react';
import Header from 'components/common/Header';
import Chat from 'components/chat';

const ChatPage = props => {
    
    return (
        <Fragment>
            <Header/>
            <Chat/>
        </Fragment>
    );
};

export default ChatPage;