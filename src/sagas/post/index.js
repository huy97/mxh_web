import { takeEvery, call, put } from "redux-saga/effects";
import { FETCH_POST_START, FETCH_POST_SUCCESS, FETCH_POST_FAILED, POST_LIKE_SUCCESS, POST_LIKE_START, POST_DISLIKE_START, POST_DISLIKE_SUCCESS } from "reducers/post";
import { fetchForumPost, postLike, postDislike } from "apis";

function* handleFetchPost(action){
    const {userId, start, limit} = action.payload;
    try{
        const result = yield call(fetchForumPost, userId, start, limit);
        yield put({type: FETCH_POST_SUCCESS, payload: {
            data: result.data,
            total: result.total
        }});
    }catch{
        yield put({type: FETCH_POST_FAILED});
    }
}

function* handleLikePost(action){
    const {postId, emojiType} = action.payload;
    try{
        const result = yield call(postLike, postId, emojiType);
        yield put({type: POST_LIKE_SUCCESS, payload: {
            postId,
            like: result.like
        }})
    }catch(e){
        console.log(e);
    }
}

function* handleDislikePost(action){
    const {postId} = action.payload;
    try{
        yield call(postDislike, postId);
        yield put({type: POST_DISLIKE_SUCCESS, payload: {
            postId
        }})
    }catch(e){
        console.log(e);
    }
}

function* postSaga(){
    yield takeEvery(FETCH_POST_START, handleFetchPost);
    yield takeEvery(POST_LIKE_START, handleLikePost);
    yield takeEvery(POST_DISLIKE_START, handleDislikePost);
}

export default postSaga;