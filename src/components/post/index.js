import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CreatePost from './CreatePost';
import PostItem from './PostItem';
import { fetchPost, addNewPost } from 'reducers/post';

const Post = props => {
    const currentUser = useSelector(state => state.user);
    const {list, total} = useSelector(state => state.post);
    const [pagination, setPagination] = useState({total: 0, start: 0, limit: 10});
    const [loading, setLoading] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!list.length){
            setLoading(true);
            dispatch(fetchPost(null, pagination.start, pagination.limit));
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setPagination({...pagination, total});
        setLoading(false);
        // eslint-disable-next-line
    }, [list]);

    useEffect(() => {
        const container = document.getElementById('container');
        container.addEventListener("scroll", onScroll);

        return () => {
            container.removeEventListener("scroll", onScroll);
        }
    });

    const onPostCreated = (item) => {
        dispatch(addNewPost(item));
    }

    const onScroll = (e) => {
        if(e.target.scrollTop === (e.target.scrollHeight - e.target.clientHeight)){
            if(list.length < pagination.total){
                pagination.start = list.length;
                setPagination(pagination);
                dispatch(fetchPost(null, pagination.start, pagination.limit));
            }else{
                setShowEmpty(true);
            }
        }
    }

    return (
        <div className="post">
            <CreatePost currentUser={currentUser} onSuccess={onPostCreated}/>
            <div className="post-container">
                {list.map((item, index) => (
                    <PostItem key={item._id} item={item} currentUser={currentUser}/>
                ))}
                {loading ? <div className="post-container__loading"></div> : null}
                {showEmpty ? <div className="post-container__empty">
                    <span>Không còn bài viết</span>
                </div> : null}
            </div>
        </div>
    );
};

export default Post;