import React, {useState, useEffect, Fragment, useRef} from 'react';
import PropTypes from 'prop-types';
import CreateComment from './CreateComment';
import {fetchCommentReply} from 'apis';
import { timeSince } from 'utils/helper';
import LoadImage from 'components/common/LoadImage';

const CommentItem = React.memo(props => {
    const {currentUser} = props;
    const comment = props.item;
    const [replies, setReplies] = useState([]);
    const [pagination, setPagination] = useState({total: 0, start: 0, limit: 10});
    const [showReply, setShowReply] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        setPagination({
            ...pagination,
            total: comment.reply
        });
        // eslint-disable-next-line
    }, []);

    const handleShowReply = () => {
        if(!showReply)
            setShowReply(true);
        else {
            if(inputRef.current) inputRef.current.focus();
        }
    }

    const onReplyCreated = (item) => {
        let newReply = [
            ...replies,
            item
        ];
        pagination.total++;
        comment.reply++;
        setPagination(pagination);
        setReplies(newReply);
    }

    const handleLoadReply = async () => {
        try {
            if (replies.length === pagination.total) 
                return;
            if (replies.length && replies.length < pagination.total) {
                pagination.start = replies.length;
                setPagination(pagination);
            }
            const result = await fetchCommentReply(
                comment._id,
                pagination.start,
                pagination.limit
            );
            let newReplies = [
                ...result
                    .data
                    .reverse(),
                ...replies
            ];
            setPagination({
                ...pagination,
                total: result.total
            });
            setReplies(newReplies);
        } catch (e) {
            console.log(e);
        }
    }

    const handleShowAndLoadReply = () => {
        if(!showReply){
            setShowReply(true);
            handleLoadReply();
        }
    }

    return (
        <Fragment>
            <div className="comment-item">
                <div className="comment-item__avatar">
                    <LoadImage src={comment.user.avatar} alt={comment.user.fullName}/>
                </div>
                <div className="comment-item__content">
                    <b className="comment-item__content-name">{comment.user.fullName}</b>
                    <span className="comment-item__content-text">{comment.content}</span>
                </div>
                <div className="comment-item__action">
                    {
                        comment.type === "COMMENT" ? <b className="comment-item__action-reply" onClick={handleShowReply}>Trả lời</b> : null
                    }
                    <i className="comment-item__action-time">{timeSince(comment.createdAt)}</i>
                    {comment.reply ? <i className="comment-item__action-reply-count" onClick={handleShowAndLoadReply}>{comment.reply} phản hồi</i> : null}
                </div>
            </div>
            {
                comment.type === "COMMENT" && showReply
                    ? <div className="reply">
                            {
                                comment.reply && (replies.length !== pagination.total)
                                    ? <span className="post-comment__count" onClick={handleLoadReply}>Xem {
                                                replies.length
                                                    ? `thêm ${pagination.total - replies.length}`
                                                    : ''
                                            } phản hồi</span>
                                    : null
                            }
                            {
                                replies.map(
                                    (reply) => <CommentItem item={reply} key={reply._id} currentUser={currentUser}/>
                                )
                            }
                            <CreateComment
                                ref={inputRef}
                                currentUser={currentUser}
                                commentId={comment._id}
                                onCreated={onReplyCreated}/>
                        </div>
                    : null
            }
        </Fragment>
    );
});

CommentItem.propTypes = {
    item: PropTypes.object.isRequired
};

export default CommentItem;