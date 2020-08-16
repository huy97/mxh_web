export const LOGIN_START = "LOGIN_START";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const GET_INFO_START = "GET_INFO_START";
export const GET_INFO_SUCCESS = "GET_INFO_SUCCESS";
export const GET_INFO_FAILED = "GET_INFO_FAILED";

const initialState = {
    isLoggedIn: false,
    info: null
}
const userReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN_START:
        case GET_INFO_START: 
            return state;
        case LOGIN_SUCCESS:
        case GET_INFO_SUCCESS:
            const {user} = action.payload;
            state.isLoggedIn = true;
            state.info = user;
            return {
                ...state
            }
        case LOGIN_FAILED: 
        case GET_INFO_FAILED: 
            state.isLoggedIn = false;
            state.info = null;
            return {
                ...state
            }
        default:
            return state;
    }
}

export const login = (accessToken) => {
    return {
        type: LOGIN_START,
        payload: {
            accessToken
        }
    }
}

export const getUserInfo = () => {
    return {
        type: GET_INFO_START
    }
}

export default userReducer;