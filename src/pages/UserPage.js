import React, { Fragment } from 'react';
import Header from 'components/common/Header';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RiChat2Line } from 'react-icons/ri';
import OnlineList from 'components/home/OnlineList';
import GlobalConversation from 'components/common/GlobalConversation';
import UserPost from 'components/user/UserPost';

const UserPage = props => {
    const currentUser = useSelector(state => state.user);

    return (
        <Fragment>
            <Header/>
            <div className="container" id="container">
                <div className="left">
                    <div className="menu menu-fixed">
                        <ul>
                            <li>
                                <Link to="/me" className="menu-item">
                                    <div className="menu-item__icon">
                                        <img src={currentUser.info.avatar} alt={currentUser.info.fullName}/>
                                    </div>
                                    <div className="menu-item__item">
                                        {currentUser.info.fullName}
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link to="/chat" className="menu-item">
                                    <div className="menu-item__icon">
                                        <RiChat2Line size={24}/>
                                    </div>
                                    <div className="menu-item__item">
                                        Tin nhắn
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <UserPost/>
                <OnlineList/>
            </div>
            <GlobalConversation/>
        </Fragment>
    );
};

export default UserPage;