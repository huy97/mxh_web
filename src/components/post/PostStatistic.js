import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { RiThumbUpLine } from 'react-icons/ri';
import {Scrollbars} from 'react-custom-scrollbars';
import { fetchListLiked } from 'apis';
import Dialog from 'components/common/Dialog';
import LoadImage from 'components/common/LoadImage';

const PostStatistic = props => {
    const {post, currentUser} = props;
    const stats = post.likeStats.find((obj) => obj.emojiType === 1);
    const [showStats, setShowStats] = useState(false);
    const [pagination, setPagination] = useState({total: 0, start: 0, limit: 10});
    const [list, setList] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        if(showStats && scrollRef.current){
            scrollRef.current.scrollToTop();
        }
        //eslint-disable-next-line
    }, [showStats]);

    const onScroll = (e) => {
        if(e.target.scrollTop === (e.target.scrollHeight - e.target.clientHeight)){
            if(list.length < pagination.total){
                pagination.start = list.length;
                setPagination(pagination);
                fetchUserLiked();
            }
        }
    }

    const handleShowListLike = () => {
        setShowStats(true);
        if(!list.length){
            fetchUserLiked();
        }
    }

    const fetchUserLiked = async () => {
        try{
            const result = await fetchListLiked(post._id, 1, pagination.start, pagination.limit);
            setPagination({...pagination, total: result.total});
            const newList = [...list, ...result.data];
            setList(newList);
        }catch(e){
            console.log(e);
        }
    }

    const countPeopleLike = () => {
        if(post.likeInfo){
            if(stats.total > 1)  return `Bạn và ${stats.total} người khác`;
            return currentUser.info.fullName;
        }
        return stats.total;
    }

    if(stats && stats.total)
        return (
            <div className="post-item__statistic">
                <span onClick={handleShowListLike}>
                    <RiThumbUpLine size={17}/> <span>{countPeopleLike()}</span>
                </span>
                <Dialog
                    visible={showStats}
                    onClose={() => setShowStats(false)}
                    title="Đã thích">
                        <Scrollbars ref={scrollRef} autoHide autoHeight autoHeightMax={300} style={{height: 300}} onScroll={onScroll}>
                            <ul>
                                {list.map((item) => 
                                    <li className="post-item__statistic-user" key={item._id}>
                                        <div className="post-item__statistic-user__avatar">
                                            <LoadImage src={item.user.avatar} alt={item.user.fullName}/>
                                        </div>
                                        <div className="post-item__statistic-user__info">
                                            <b>{item.user.fullName}</b>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </Scrollbars>
                </Dialog>
            </div>
        );
    return null;
};

PostStatistic.propTypes = {
    post: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
};

export default PostStatistic;