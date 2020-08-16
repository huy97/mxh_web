import { combineReducers } from "redux";
import userReducer from "./user";
import postReducer from "./post";

const rootReducer = combineReducers({
    user: userReducer,
    post: postReducer
});

export default rootReducer;