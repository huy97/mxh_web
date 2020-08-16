import React, {Fragment} from 'react';
import Header from 'components/common/Header';
import GlobalConversation from 'components/common/GlobalConversation';
import {useSelector} from 'react-redux';
import {RiChat2Line} from 'react-icons/ri';
import {Link} from 'react-router-dom';
import Post from 'components/post';
import OnlineList from 'components/home/OnlineList';

const HomePage = props => {
    const user = useSelector(state => state.user);

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
                                        <img src={user.info.avatar} alt={user.info.fullName}/>
                                    </div>
                                    <div className="menu-item__item">
                                        {user.info.fullName}
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
                <Post user={user}/>
                <OnlineList/>
            </div>
            <GlobalConversation/>
        </Fragment>
    );
};

export default HomePage;