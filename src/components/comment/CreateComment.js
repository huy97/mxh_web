import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {postCreateReply, postCreateComment} from 'apis';
import { toast } from 'utils/helper';

const CreateComment = React.forwardRef((props, ref) => {
    const {currentUser, postId, commentId, onCreated} = props;
    const [content, setContent] = useState("");

    const onTextChange = (e) => {
        e.target.style.height = "";
        e.target.style.height = e.target.scrollHeight + "px";
        setContent(e.target.value);
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
            let result;
            if (!content || !content.trim()) 
                return;
            if (commentId) {
                result = await postCreateReply(commentId, content);
                let reply = {
                    ...result.reply,
                    user: currentUser.info
                }
                onCreated(reply);
            } else {
                result = await postCreateComment(postId, content);
                let comment = {
                    ...result.comment,
                    user: currentUser.info
                }
                onCreated(comment);
            }
            target.style.height = "40px";
            setContent('');
        } catch (e) {
            console.log(e);
            if(e.data && e.data.message)
                toast.error(e.data.message, {heading: "Có lỗi xảy ra!"});
        }
    }

    return (
        <div className="post-comment__create">
            <div className="post-comment__create-avatar">
                <img src={currentUser.info.avatar} alt={currentUser.info.fullName}/>
            </div>
            <div className="post-comment__create-input">
                <textarea
                    ref={ref}
                    placeholder="Viết bình luận"
                    value={content}
                    onKeyDown={onKeyDown}
                    onChange={onTextChange}></textarea>
            </div>
        </div>
    );
});

CreateComment.propTypes = {
    currentUser: PropTypes.object.isRequired,
    postId: PropTypes.string,
    commentId: PropTypes.string,
    onCreated: PropTypes.func
};

export default CreateComment;