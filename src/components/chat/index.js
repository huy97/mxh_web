import React, {useContext, useState, useEffect} from 'react';
import {SocketContext} from 'socket';
import {fetchConversation} from 'apis';
import {RiChatNewLine} from 'react-icons/ri';
import {useSelector} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';
import moment from 'moment';
import ChatContainer from 'components/chat/ChatContainer';
import ChatAvatar from './ChatAvatar';
import CreateConversation from './CreateChat';

export const getTitle = (conversation) => {
    if (conversation.isGroup) 
        return conversation.title;
    return conversation
        .userInfos
        .map((obj) => obj.fullName)
        .join(', ');
}

const Chat = props => {
    const currentUser = useSelector(state => state.user);
    const socket = useContext(SocketContext);
    const [pagination, setPagination] = useState({total: 0, start: 0, limit: 20});
    const [newConversation, setNewConversation] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [showEmpty, setShowEmpty] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        if (!conversations.length) {
            fetchListConversation();
        }
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(newConversation){
            let newList = conversations.filter((obj) => obj._id !== newConversation._id);
            newList.unshift(newConversation);
            setConversations(newList);
        }
        //eslint-disable-next-line
    }, [newConversation]);

    useEffect(() => {
        socket.on('conversation', (data) => {
            let conversation = data;
            conversation.userInfos = conversation.userInfos.filter((obj) => obj._id !== currentUser.info._id);
            setNewConversation(conversation);
        });
        //eslint-disable-next-line
    }, []);

    const fetchListConversation = async () => {
        try {
            const result = await fetchConversation(pagination.start, pagination.limit);
            let newConversations = conversations.concat(result.data);
            setPagination({
                ...pagination,
                total: result.total
            });
            setConversations(newConversations);
        } catch (e) {
            console.log(e);
        }
    }

    const onScroll = (e) => {
        if (e.target.scrollTop === (e.target.scrollHeight - e.target.clientHeight)) {
            if (conversations.length < pagination.total) {
                pagination.start = conversations.length;
                setPagination(pagination);
                fetchListConversation();
            }else{
                setShowEmpty(true);
            }
        }
    }

    const getLastMessage = (conversation) => {
        let user = conversation
            .userInfos
            .find((obj) => obj._id === conversation.lastMessage.from);
        let prefix = "";
        if (conversation.lastMessage.from === currentUser.info._id) {
            prefix = "Bạn: ";
        } else {
            if (user) {
                prefix = user.fullName + ': ';
            }
        }
        return prefix + conversation.lastMessage.message;
    }

    const handleClick = (conversation) => {
        if (currentConversation && currentConversation._id === conversation._id) {
            setCurrentConversation(null);
            return;
        }
        setCurrentConversation(conversation);
    }

    const handleClickCreate = () => {
        setShowCreate(true);
    }

    const handleCreateSuccess = (item) => {
        let newList = [item, ...conversations];
        setPagination({...pagination, total: pagination.total + 1});
        setCurrentConversation(item);
        setConversations(newList);
    }

    const isActive = (conversation) => {
        return currentConversation && currentConversation._id === conversation._id ? 'active' : '';
    }

    const isRead = (conversation) => {
        if(conversation.lastMessage){
            if(conversation.lastMessage.from === currentUser.info._id) return '';
            if(conversation.lastMessage.reads){
                if(!conversation.lastMessage.reads.find((obj) => obj.userId === currentUser.info._id)) return 'unread';
            }else{
                return 'unread';
            }
        }
        return '';
    }

    return (
        <div className="chat">
            <div className="chat-list">
                <Scrollbars onScroll={onScroll} autoHide>
                    <ul>
                        {
                            conversations.map(
                                (conversation) => <li
                                    key={conversation._id}
                                    className={`chat-list__item ${isActive(conversation)} ${isRead(conversation)}`}
                                    onClick={() => handleClick(conversation)}>
                                    <ChatAvatar conversation={conversation}/>
                                    <div className="chat-list__item-info">
                                        <div className="chat-list__item-info__title">
                                            {getTitle(conversation)}
                                        </div>
                                        {
                                            conversation.lastMessage
                                                ? <div className="chat-list__item-info__message">
                                                        <span className="chat-list__item-info__message-content">
                                                            {getLastMessage(conversation)}
                                                        </span>
                                                        <span className="chat-list__item-info__message-time">{moment(conversation.lastMessage.createdAt).format('DD/MM')}</span>
                                                    </div>
                                                : null
                                        }
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                    {
                        showEmpty
                            ? <div className="chat-list__empty">
                                    <span>Không còn tin nhắn nào</span>
                                </div>
                            : null
                    }
                </Scrollbars>
                <div className="chat-list__create" onClick={handleClickCreate}>
                    <RiChatNewLine size={24}/>
                </div>
            </div>
            {
                currentConversation
                    ? <ChatContainer current={currentConversation} currentUser={currentUser}/>
                    : null
            }
            <CreateConversation
                show={showCreate}
                onClose={() => setShowCreate(false)}
                onSuccess={handleCreateSuccess}/>
        </div>
    );
};

export default Chat;