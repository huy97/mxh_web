import React, { Suspense, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from 'reducers/user';
import NotFoundPage from 'pages/NotFoundPage';
import SplashScreen from 'components/SplashScreen';
import SocketProvider from 'socket';

const HomePage = React.lazy(() => import('pages/HomePage'));
const UserPage = React.lazy(() => import('pages/UserPage'));
const ChatPage = React.lazy(() => import('pages/ChatPage'));
const LoginPage = React.lazy(() => import('pages/LoginPage'));

function AuthRoute(props){
  const [isRestoreToken, setRestoreToken] = useState(true);
  const {path, exact, component} = props;
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if(!user || !user.isLoggedIn){
      const accessToken = localStorage.getItem('accessToken');
      if(!accessToken){
        setRestoreToken(false);
        return;
      };
      dispatch(getUserInfo());
    }else{
      setRestoreToken(false);
    }
  }, [user, dispatch]);
  
  if(isRestoreToken) return <SplashScreen/>;
  if(!isRestoreToken && !user.isLoggedIn) return <Redirect to="/login" />;
  return (
    <SocketProvider>
      <Route path={path} exact={exact} component={component}/>
    </SocketProvider>
  );
}

function App() {
  return (
    <Suspense fallback={<SplashScreen/>}>
      <BrowserRouter>
        <Switch>
            <AuthRoute path="/" exact component={HomePage} />
            <AuthRoute path="/me" component={UserPage} /> 
            <AuthRoute path="/user/:userId" component={UserPage} />
            <AuthRoute path="/chat" component={ChatPage} />
            <Route path="/login" component={LoginPage}/>
            <Route component={NotFoundPage}/>
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
}

AuthRoute.propTypes = {
    path: PropTypes.string.isRequired,
    exact: PropTypes.bool,
    component: PropTypes.any.isRequired
};

export default App;
