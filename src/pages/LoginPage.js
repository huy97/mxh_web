import React from 'react';
import {FacebookProvider, Login} from 'react-facebook';
import { useDispatch, useSelector } from 'react-redux';
import { login } from 'reducers/user';
import { Redirect } from 'react-router-dom';
import {RiFacebookLine} from 'react-icons/ri';

const LoginPage = props => {

    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleResponse = (data) => {
        const {accessToken} = data.tokenDetail;
        if(accessToken){
            dispatch(login(accessToken));
        }
    }
     
    const  handleError = (error) => {
        console.log(error);
    }

    if(user && user.isLoggedIn) return <Redirect to="/"/>;
    return (
        <FacebookProvider appId="328280508221400">
            <Login
                scope="email"
                onCompleted={handleResponse}
                onError={handleError}
            >
                {({handleClick}) => (
                    <div className="login">
                        <button className="login__button" onClick={handleClick}><RiFacebookLine size={20}/> Đăng nhập bằng Facebook</button>
                    </div>
                )}
            </Login>
        </FacebookProvider>
    );
};

export default LoginPage;