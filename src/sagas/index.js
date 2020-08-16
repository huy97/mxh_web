import {all} from 'redux-saga/effects';
import userSaga from './user';
import postSaga from './post';

function* rootSaga(){
    yield all([
        userSaga(),
        postSaga()
    ]);
}

export default rootSaga;