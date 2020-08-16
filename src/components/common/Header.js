import React from 'react';
import logo from 'assets/logo.png';
import { useSelector } from 'react-redux';
import { RiArrowDownSLine, RiHome2Line, RiChat2Line } from 'react-icons/ri';
import { useRouteMatch, Link } from 'react-router-dom';

const Header = props => {
    const user = useSelector(state => state.user);
    const currentRoute = useRouteMatch();

    const getActiveRoute = (path) => {
        return currentRoute.path === path ? "active" : "";
    }

    return (
        <div className="header header-fixed">
            <div className="header__logo">
                <img src={logo} alt="MXH Beta"/>
            </div>
            <div className="header-nav">
                <div className={`header-nav__item ${getActiveRoute('/')}`}>
                    <Link to="/" className="header-nav__item-icon">
                        <RiHome2Line size={24}/>
                    </Link>
                </div>
                <div className={`header-nav__item ${getActiveRoute('/chat')}`}>
                    <Link to="/chat" className="header-nav__item-icon">
                        <RiChat2Line size={24}/>
                    </Link>
                </div>
            </div>
            <div className="header-auth">
                <div className={`header-auth__info ${getActiveRoute('/me')}`}>
                    <div className="header-auth__info-avatar">
                        <img src={user.info.avatar} alt={user.info.fullName}/>
                    </div>
                    <Link to="/me" className="header-auth__info-name">{user.info.fullName} {user.info.fullName}</Link>
                </div>
                <div className="header-auth__action">
                    <RiArrowDownSLine size={30}/>
                </div>
            </div>
        </div>
    );
};

export default Header;