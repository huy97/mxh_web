import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import CreateComment from './CreateComment';
import CommentItem from './CommentItem';
import {fetchForumComment} from 'apis';

const Comment = React.memo(props => {
    const {post, currentUser, inputRef} = props;
    const [pagination, setPagination] = useState({total: 0, start: 0, limit: 10});
    const [comments, setComment] = useState([]);

    useEffect(() => {
        setPagination({
            ...pagination,
            total: post.comment
        });
        // eslint-disable-next-line
    }, []);

    const onCommentCreated = (item) => {
        let newComments = [
            ...comments,
            item
        ];
        pagination.total++;
        setPagination(pagination);
        setComment(newComments);
    }

    const handleLoadComment = async () => {
        try {
            if (comments.length === pagination.total) 
                return;
            if (comments.length && comments.length < pagination.total) {
                pagination.start = comments.length;
                setPagination(pagination);
            }
            const result = await fetchForumComment(
                post._id,
                pagination.start,
                pagination.limit
            );
            let newComments = [
                ...result
                    .data
                    .reverse(),
                ...comments
            ];
            setPagination({
                ...pagination,
                total: result.total
            });
            setComment(newComments);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="post-comment">
            {
                post.comment && (comments.length !== pagination.total)
                    ? <span className="post-comment__count" onClick={handleLoadComment}>Xem {
                                comments.length
                                    ? `thêm ${pagination.total - comments.length}`
                                    : ''
                            } bình luận</span>
                    : null
            }
            {
                comments.map(
                    (comment) => <CommentItem key={comment._id} item={comment} currentUser={currentUser}/>
                )
            }
            <CreateComment
                ref={inputRef}
                postId={post._id}
                currentUser={currentUser}
                onCreated={onCommentCreated}/>
        </div>
    );
});

Comment.propTypes = {
    post: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    inputRef: PropTypes.object
};

export default Comment;