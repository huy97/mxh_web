export const ADD_NEW_POST = "ADD_NEW_POST";
export const FETCH_POST_START = "FETCH_POST_START";
export const FETCH_POST_SUCCESS = "FETCH_POST_SUCCESS";
export const FETCH_POST_FAILED = "FETCH_POST_FAILED";
export const POST_LIKE_START = "POST_LIKE_START";
export const POST_LIKE_SUCCESS = "POST_LIKE_SUCCESS";
export const POST_DISLIKE_START = "POST_DISLIKE_START";
export const POST_DISLIKE_SUCCESS = "POST_DISLIKE_SUCCESS";

const initialState = {
    list: [],
    total: 0
};

const postReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_NEW_POST: {
            const {post} = action.payload;
            state.list = [post, ...state.list];
            state.total++;
            return {
                ...state
            };
        }

        case FETCH_POST_START:
        case POST_LIKE_START:
        case POST_DISLIKE_START:
            return state;

        case FETCH_POST_SUCCESS: {
            const {data, total} = action.payload;
            state.list = state.list.concat(data);
            state.total = total
            return {
                ...state
            };
        }

        case POST_LIKE_SUCCESS: {
            const {postId, like} = action.payload;
            const post = state.list.find((obj) => obj._id === postId);
            if(post){
                let likeStat = post.likeStats.find((obj) => obj.emojiType === 1);
                if(likeStat){
                    likeStat.total++;
                }else{
                    post.likeStats.push({
                        emojiType: like.emojiType,
                        total: 1
                    });
                }
                post.likeInfo = like;
            }
            return {
                ...state
            }
        }

        case POST_DISLIKE_SUCCESS: {
            const {postId} = action.payload;
            const post = state.list.find((obj) => obj._id === postId);
            if(post){
                post.likeInfo = null;
                let likeStat = post.likeStats.find((obj) => obj.emojiType === 1);
                if(likeStat){
                    likeStat.total--;
                }
            }
            return {
                ...state
            }
        }

        case FETCH_POST_FAILED:
        default:
            return state;
    }
}

export const fetchPost = (userId, start, limit) => {
    return {
        type: FETCH_POST_START,
        payload: {
            userId,
            start,
            limit
        }
    }
}

export const addNewPost = (post) => {
    return {
        type: ADD_NEW_POST,
        payload: {
            post
        }
    }
}

export const likePost = (postId, emojiType) => {
    return {
        type: POST_LIKE_START,
        payload: {
            postId,
            emojiType
        }
    }
}

export const dislikePost = (postId) => {
    return {
        type: POST_DISLIKE_START,
        payload: {
            postId
        }
    }
}

export default postReducer;