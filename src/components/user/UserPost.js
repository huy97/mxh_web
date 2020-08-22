import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CreatePost from 'components/post/CreatePost';
import PostItem from 'components/post/PostItem';
import { useRouteMatch } from 'react-router-dom';

const UserPost = props => {
    const {params} = useRouteMatch();
    const currentUser = useSelector(state => state.user);
    const [list, setList] = useState([]);
    const [pagination, setPagination] = useState({total: 0, start: 0, limit: 10});
    const [loading, setLoading] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false); 

    useEffect(() => {
        console.log(params);
        // eslint-disable-next-line
    }, [params]);

    useEffect(() => {
        const container = document.getElementById('container');
        container.addEventListener("scroll", onScroll);

        return () => {
            container.removeEventListener("scroll", onScroll);
        }
    });

    const onPostCreated = (item) => {

    }

    const onScroll = (e) => {
        if(e.target.scrollTop === (e.target.scrollHeight - e.target.clientHeight)){
            if(list.length < pagination.total){
                pagination.start = list.length;
                setPagination(pagination);
            }else{
                setShowEmpty(true);
            }
        }
    }

    return (
        <div className="post">
            <div className="user-info">
                <div className="user-info__cover">
                    <img src={currentUser.info.cover} alt={currentUser.info.fullName}/>
                </div>
                <div className="user-info__avatar">
                    <img src={currentUser.info.avatar} alt={currentUser.info.fullName}/>
                </div>
                <h2>{currentUser.info.fullName}</h2>
            </div>
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

export default UserPost;