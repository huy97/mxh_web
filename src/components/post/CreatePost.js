import React, {Fragment, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/common/Dialog';
import { postCreateForumPost } from 'apis';
import { toast } from 'utils/helper';

const CreatePost = props => {
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const {currentUser, onSuccess} = props;
    const inputRef = useRef(null);

    const onFocus = () => {
        setShowCreate(true);
        inputRef.current.blur();
    }

    const onTitleChange = (event) => {
        setTitle(event.target.value);
    }

    const onContentChange = (event) => {
        setContent(event.target.value);
    }

    const canCreate = () => {
        return title && content ? true : false;
    }

    const handleSubmit = async () => {
        if(!canCreate()) return false;
        try{
            const result = await postCreateForumPost(title, content);
            if(result && result.status === 200){
                setShowCreate(false);
                onSuccess({
                    ...result.post,
                    user: currentUser.info
                });
            }
        }catch(e){
            console.log(e);
            if(e.data && e.data.message)
                toast.error(e.data.message, {heading: "Có lỗi xảy ra!"});
        }
    }


    return (
        <Fragment>
            <div className="post-create">
                <div className="post-create__avatar">
                    <img src={currentUser.info.avatar} alt={currentUser.info.fullName}/>
                </div>
                <div className="post-create__input">
                    <input ref={inputRef} placeholder="Bạn đang nghĩ gì?" defaultValue={content} onFocus={onFocus}/>
                </div>
            </div>
            <Dialog
                visible={showCreate}
                onClose={() => setShowCreate(false)}
                title="Tạo bài viết">
                <div className="post-panel">
                    <div className="post-panel__avatar">
                        <img src={currentUser.info.avatar} alt={currentUser.info.fullName}/>
                    </div>
                    <div className="post-panel__menu">
                        <b className="post-panel__menu-name">{currentUser.info.fullName}</b>
                        <div className="post-panel__menu-input">
                            <input type="text" name="title" placeholder="Tiêu đề bài đăng" value={title} onChange={onTitleChange}/>
                        </div>
                        <div className="post-panel__menu-text">
                            <textarea name="content" placeholder="Bạn đang nghĩ gì?" value={content} onChange={onContentChange}></textarea>
                        </div>
                    </div>
                    <div className="post-panel__bottom">
                        <button className={`post-panel__bottom-btn__create ${canCreate() ? 'active' : ''}`} onClick={handleSubmit}>Đăng bài</button>
                    </div>
                </div>

            </Dialog>
        </Fragment>
    );
};

CreatePost.propTypes = {
    currentUser: PropTypes.object.isRequired,
    onSuccess: PropTypes.func
}

CreatePost.defaultProps = {
    onSuccess: () => {}
}

export default CreatePost;