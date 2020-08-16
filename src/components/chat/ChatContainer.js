import React, { Fragment, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { RiInformationLine } from 'react-icons/ri';
import { getTitle } from '.';
import { timeSince, toast } from 'utils/helper';
import { fetchConversationMessage, postCreateMessage, postMarkReading, getLastRead } from 'apis';
import {Scrollbars} from 'react-custom-scrollbars';
import { SocketContext } from 'socket';
import ChatInfo from './ChatInfo';
import ChatAvatar from './ChatAvatar';
import MessageItem from './MessageItem';
import TypingItem from './TypingItem';
import debounce from 'lodash/debounce';
import { useRef } from 'react';

const ChatContainer = props => {
    const {current, currentUser} = props;
    const [showInfo, setShowInfo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [showEmpty, setShowEmpty] = useState(false);
    const [listTyping, setListTyping] = useState([]);
    const [isTyping, setTyping] = useState(false);
    const [message, setMessage] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [pagination, setPagination] = useState({total: 0, start: 0, limit: 30});
    const [messageList, setMessageList] = useState([]);
    const socket = useContext(SocketContext);
    const scrollRef = useRef(null);
    const debounced = debounce(() => {
        handleTyping(false);
    }, 1000);


    useEffect(() => {
        markReading();
        lastRead();
        fetchListMessage();
        //eslint-disable-next-line
    }, [current]);

    useEffect(() => {
        if(scrollRef.current){
            // scrollRef.current.view.style["scroll-behavior"] = "smooth";
            if(scrollTop === 0){
                scrollRef.current.scrollToBottom();
            }else{
                const sTop = scrollRef.current.getScrollHeight() - scrollRef.current.getClientHeight();
                scrollRef.current.scrollTop(sTop - scrollTop);
            }
        }
        //eslint-disable-next-line
    }, [messageList]);
    
    useEffect(() => {
        socket.on('message', (data) => {
            if(current._id === data.conversationId){
                setNewMessage(data);
            }
        });
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        socket.on('reading', (data) => {
            console.log(data);
        });
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(newMessage){
            setPagination({...pagination, total: pagination.total + 1});
            let newList = [...messageList, newMessage];
            setMessageList(newList);
            if(scrollRef.current){
                scrollRef.current.scrollToBottom();
            }
        }
        //eslint-disable-next-line
    }, [newMessage]);

    useEffect(() => {
        socket.on('typing', (data) => {
            const {conversationId, userTyping, isTyping} = data;
            if(conversationId !== current._id || userTyping === currentUser.info._id) return;
            if(isTyping){
                let user = listTyping.find((_id) => _id === userTyping);
                if(!user){
                    let newList = [...listTyping, userTyping];
                    setListTyping(newList);
                }
                if(scrollRef.current){
                    const sTop = scrollRef.current.getScrollHeight() - scrollRef.current.getClientHeight();
                    if(scrollRef.current.getScrollTop() === sTop){
                        scrollRef.current.scrollToBottom();
                    }
                }
            }else{
                let newList = listTyping.filter((_id) => _id !== userTyping);
                setListTyping(newList);
            }
        });
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        debounced();
        return () => {
            debounced.cancel();
        }
        //eslint-disable-next-line
    }, [message]);

    const markReading = async () => {
        try{
            if(current.lastMessage && current.lastMessage.from !== currentUser.info._id){
                await postMarkReading(current._id, current.lastMessage._id);
            }
        }catch(e){
            console.log(e);
        }
    }

    const lastRead = async () => {
        try{
            await getLastRead(current._id);
        }catch(e){
            console.log(e);
        }
    }

    const onScroll = (e) => {
        if (e.target.scrollTop === 0) {
            const sTop = scrollRef.current.getScrollHeight() - scrollRef.current.getClientHeight();
            setScrollTop(sTop);
            if (messageList.length < pagination.total) {
                pagination.start = messageList.length;
                setPagination(pagination);
                fetchListMessage(false);
            }else{
                setShowEmpty(true);
            }
        }
    }

    const handleShowInfo = () => {
        setShowInfo(!showInfo);
    }

    const getActiveStatus = () => {
        const [first] = current.userInfos;
        if(first){
            if(first.online) return "Đang hoạt động";
            return "Hoạt động " + timeSince(first.updatedAt, 2);
        }
    }

    const fetchListMessage = async (init = true) => {
        try{
            setLoading(true);
            const result = await fetchConversationMessage(current._id, pagination.start, pagination.limit);
            if(init){
                setMessageList(result.data.reverse());
            }else{
                let newList = [...result.data.reverse(), ...messageList];
                setMessageList(newList);
            }
            setPagination({...pagination, total: result.total});
            setLoading(false);
        }catch(e){
            console.log(e);
            setLoading(false);
        }
    }

    const handleTyping = (typing) => {
        setTyping(typing);
        socket.emit('typing', {conversationId: current._id, userTyping: currentUser.info._id, isTyping: typing, listUsers: current.userInfos.map((obj) => obj._id)});
    }

    const handleMessageChange = (e) => {
        if(!isTyping){
            handleTyping(true);
        }
        e.target.style.height = "";
        e.target.style.height = e.target.scrollHeight + "px";
        setMessage(e.target.value);
    }

    const onKeyDown = (e) => {
        if (e.shiftKey && e.keyCode === 13) {
            return;
        }

        if (e.keyCode === 13) {
            e.preventDefault();
            handleSubmit(e.target);
        }
    }

    const handleSubmit = async (target) => {
        try {
            if (!message || !message.trim()) 
                return;
            debounced.cancel();
            handleTyping(false);
            const result = await postCreateMessage(current._id, message);
            let newList = [...messageList, result.item];
            setPagination({...pagination, total: pagination.total + 1});
            setMessageList(newList);
            if(scrollRef.current){
                scrollRef.current.scrollToBottom();
            }
            target.style.height = "40px";
            setMessage('');
        } catch (e) {
            console.log(e);
            if(e.data && e.data.message)
                toast.error(e.data.message, {heading: "Có lỗi xảy ra!"});
        }
    }

    return (
        <Fragment>
            <div className="chat-container">
                <div className="chat-container__header">
                    <div className="chat-container__header-info">
                        <ChatAvatar lazy={false} conversation={current}/>
                        <div className="chat-container__header-info__name">
                            <h3>{getTitle(current)}</h3>
                            {!current.isGroup ? <span>{getActiveStatus()}</span> : null}
                        </div>
                    </div>
                    <button className={`chat-container__header-btn ${showInfo ? 'active' : ''}`} onClick={handleShowInfo}>
                        <RiInformationLine size={24}/>
                    </button>
                </div>
                <div className="chat-container__wrapper">
                    <div className="chat-container__wrapper-body">
                        {loading ? <div className="chat-container__wrapper-body__loading"><span className="chat-container__wrapper-body__loading-loaded"></span></div> : null}
                        <Scrollbars ref={scrollRef} autoHide onScroll={onScroll}>
                            {
                                showEmpty
                                    ? <div className="chat-list__empty">
                                            <span>Không còn tin nhắn nào</span>
                                        </div>
                                    : null
                            }
                            <div className="chat-container__message">
                                {messageList.map((message) => <MessageItem key={message._id} item={message} userInfos={current.userInfos} currentUser={currentUser}/>)}
                                {listTyping.map((id) => <TypingItem key={id} id={id} userInfos={current.userInfos}/>)}
                            </div>
                        </Scrollbars>
                    </div>
                </div>
                <div className="chat-container__input">
                    <textarea placeholder="Nhập tin nhắn..." value={message} onChange={handleMessageChange} onKeyDown={onKeyDown}></textarea>
                </div>
            </div>
            {showInfo ? <ChatInfo current={current}/> : null}
        </Fragment>
    );
};

ChatContainer.propTypes = {
    current: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};

export default ChatContainer;