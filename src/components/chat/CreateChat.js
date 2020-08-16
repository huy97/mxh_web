import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/common/Dialog';
import {findUser, postCreateConversation} from 'apis';
import Scrollbars from 'react-custom-scrollbars';
import LoadImage from 'components/common/LoadImage';
import debounce from 'lodash/debounce';
import { toast } from 'utils/helper';

const CreateConversation = props => {
    const {show, onClose, onSuccess} = props;
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [userList, setUserList] = useState([]);
    const [pagination, setPagination] = useState({total: 0, start: 0, limit: 10});
    const [selectedUser, setSelectedUser] = useState([]);
    const debounced = debounce(() => {
        setLoading(true);
        setSelectedUser([]);
        setPagination({total: 0, start: 0, limit: 10});
        findUserList();
    }, 1000);

    useEffect(() => {
        setKeyword("");
        setTitle("");
        setMessage("");
        setSelectedUser([]);
        setPagination({total: 0, start: 0, limit: 10});
        if (show) 
            findUserList();
        }
        //eslint-disable-next-line
    , [show]);

    useEffect(() => {
        debounced();
        return() => {
            debounced.cancel();
        }
        //eslint-disable-next-line
    }, [keyword]);

    const onScroll = (e) => {
        if (e.target.scrollTop === (e.target.scrollHeight - e.target.clientHeight)) {
            if (userList.length < pagination.total) {
                pagination.start = userList.length;
                setPagination(pagination);
                findUserList(false);
            }
        }
    }

    const findUserList = async (init = true) => {
        try {
            const result = await findUser(keyword, pagination.start, pagination.limit);
            if (!init) {
                let newList = userList.concat(result.data);
                setUserList(newList);
                setPagination({
                    ...pagination,
                    total: result.total
                });
            } else {
                setUserList(result.data);
                setPagination({
                    start: 0,
                    limit: 10,
                    total: result.total
                });
            }
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    }

    const findSelected = (id) => {
        return selectedUser.find((_id) => _id === id)
            ? 'selected'
            : '';
    }

    const handleSelected = (id) => {
        const selected = selectedUser.find((_id) => _id === id);
        if (selected) {
            let newList = selectedUser.filter((_id) => _id !== id);
            setSelectedUser(newList)
        } else {
            let newList = [
                ...selectedUser,
                id
            ];
            setSelectedUser(newList);
        }
    }

    const canCreate = () => {
        if(selectedUser.length){
            if(selectedUser.length > 1){
                if(title) return true;
                else return false;
            }
            return true;
        }
        return false;
    }

    

    const handleSubmit = async () => {
        if(!canCreate()) return;
        try{
            const result = await postCreateConversation(selectedUser, title, message);
            onSuccess(result.conversation);
            onClose();
        }catch(e){
            console.log(e);
            if(e.data && e.data.message)
                toast.error(e.data.message, {heading: "Có lỗi xảy ra!"});
        }
    }

    return (
        <Dialog
            visible={show}
            onClose={onClose}
            style={{
                width: 400
            }}
            title="Tin nhắn mới">
            <div className="chat-list__findbox-input">
                <input
                    type="text"
                    placeholder="Tìm kiếm"
                    value={keyword}
                    onChange={handleInputChange}/> {
                    loading
                        ? <span className="chat-list__findbox-input__loading"></span>
                        : null
                }
            </div>
            <Scrollbars
                autoHide
                autoHeight
                autoHeightMin={20}
                autoHeightMax={200}
                onScroll={onScroll}>
                <ul>
                    {
                        userList.map(
                            (item) => <li
                                className="chat-list__findbox-user"
                                key={item._id}
                                onClick={() => handleSelected(item._id)}>
                                <div className={`chat-list__findbox-user__select ${findSelected(item._id)}`}></div>
                                <div className="chat-list__findbox-user__avatar">
                                    <LoadImage src={item.avatar} alt={item.fullName}/>
                                </div>
                                <div className="chat-list__findbox-user__info">
                                    <b>{item.fullName}</b>
                                </div>
                            </li>
                        )
                    }
                </ul>
                {
                    !userList.length
                        ? <div className="chat-list__empty">
                                <span>Không tìm thấy bản ghi nào</span>
                            </div>
                        : null
                }
            </Scrollbars>
            {
                selectedUser.length > 1
                    ? <div className="chat-list__findbox-title">
                        <input type="text" placeholder="Tên nhóm" value={title} onChange={handleTitleChange}/>
                    </div>
                    : null
            }
            <div className="chat-list__findbox-message">
                <textarea type="text" placeholder="Tin nhắn" value={message} onChange={handleMessageChange}></textarea>
            </div>
            <div className={`chat-list__findbox-button ${canCreate() ? 'active' : ''}`}>
                <button onClick={handleSubmit}>Gửi tin nhắn</button>
            </div>
        </Dialog>
    );
};

CreateConversation.propTypes = {
    show: PropTypes.bool,
    onSuccess: PropTypes.func,
    onClose: PropTypes.func
};

export default CreateConversation;