import { takeLatest, call, put } from "redux-saga/effects";
import { LOGIN_START, LOGIN_FAILED, LOGIN_SUCCESS, GET_INFO_START, GET_INFO_SUCCESS, GET_INFO_FAILED } from "reducers/user";
import { postLogin, getUserInfo } from "apis";

function* handleLogin(action){
    try{
        const {accessToken} = action.payload;
        const {user} = yield call(postLogin, accessToken);
        if(user){
            yield put({type: LOGIN_SUCCESS, payload: {user}});
            localStorage.setItem('accessToken', user.accessToken);
            localStorage.setItem('refreshToken', user.refreshToken);
            return;
        }
        yield put({type: LOGIN_FAILED});
    }catch(e){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        yield put({type: LOGIN_FAILED});
    }
}

function* handleGetUserInfo(){
    try{
        const {user} = yield call(getUserInfo);
        if(user){
            yield put({type: GET_INFO_SUCCESS, payload: {user}});
            localStorage.setItem('accessToken', user.accessToken);
            localStorage.setItem('refreshToken', user.refreshToken);
            return;
        }
        yield put({type: GET_INFO_FAILED});
    }catch(e){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        yield put({type: GET_INFO_FAILED});
    }
}

function* userSaga(){
    yield takeLatest(LOGIN_START, handleLogin);
    yield takeLatest(GET_INFO_START, handleGetUserInfo);
};

export default userSaga;