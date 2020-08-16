export const CHAT_CONNECTED = "CHAT_CONNECTED";
export const CHAT_DISCONNECT = "CHAT_DISCONNECT";

const initialState = {
    connected: false,
    list: [],
    activeChat: null
};

const conversationReducer = (state = initialState, action) => {
    switch(action.type){
        default:
            return state;
    }
}

export default conversationReducer;