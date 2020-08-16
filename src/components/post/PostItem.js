import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { RiThumbUpLine, RiChat1Line, RiTimeLine } from 'react-icons/ri';
import { timeSince } from 'utils/helper';
import { useDispatch } from 'react-redux';
import { dislikePost, likePost } from 'reducers/post';
import Comment from 'components/comment';
import PostModify from './PostModify';
import PostStatistic from './PostStatistic';
import LoadImage from 'components/common/LoadImage';

const PostItem = props => {
    const {item, currentUser} = props;
    const inputRef = useRef(null);
    const dispatch = useDispatch();

    const handleClickComment = () => {
        inputRef.current.focus();
    }

    const handleLike = async () => {
        if(item.likeInfo){
            dispatch(dislikePost(item._id));
        }else{
            dispatch(likePost(item._id, 1));
        }
    }

    return (
        <div className="post-item">
            {item.userId === currentUser.info._id ? <PostModify post={item}/> : null}
            <div className="post-item__user">
                <div className="post-item__user-avatar">
                    <LoadImage src={item.user.avatar} alt={item.user.fullName}/>
                </div>
                <div className="post-item__user-info">
                    <b className="post-item__user-info__name">{item.user.fullName}</b>
                    <i className="post-item__user-info__time"><RiTimeLine/> {timeSince(item.createdAt)}</i>
                </div>
            </div>
            <div className="post-item__title">
                <h1>{item.title}</h1>
            </div>
            <div className="post-item__content">
                {item.content}
            </div>
            <PostStatistic post={item} currentUser={currentUser}/>
            <div className="post-item__action">
                <div className={`post-item__action-reaction ${item.likeInfo ? 'active' : null}`} onClick={handleLike}>
                    <RiThumbUpLine size={20}/>
                    <span>{item.likeInfo ? 'Bỏ thích' : 'Thích'}</span>
                </div>
                <div className="post-item__action-comment" onClick={handleClickComment}>
                    <RiChat1Line size={20}/>
                    <span>Bình luận</span>
                </div>
            </div>
            <Comment post={item} currentUser={currentUser} inputRef={inputRef}/>
        </div>
    );
};

PostItem.propTypes = {
    item: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};

export default PostItem;