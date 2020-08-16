import services from "./service";

export const postLogin = async (accessToken) => {
    return await services.post('login', {accessToken});
}

export const getUserInfo = async () => {
    return await services.get('user');
}

export const findUser = async (keyword, start, limit) => {
    return await services.get('user/find-custom', {
        params: {
            keyword,
            start,
            limit
        }
    });
}

export const postCreateForumPost = async (title, content) => {
    return await services.post('post', {
        title,
        content
    });
}

export const fetchForumPost = async (userId, start, limit) => {
    let url = "post/list";
    if(userId){
        url = `user/${userId}/post`;
    }
    return await services.get(url, {
        params: {
            start: start,
            limit: limit
        }
    });
}

export const fetchForumComment = async (postId, start, limit) => {
    let url = `post/${postId}/comment`;
    return await services.get(url, {
        params: {
            start: start,
            limit: limit
        }
    });
}

export const fetchCommentReply = async (commentId, start, limit) => {
    let url = `comment/${commentId}/reply`;
    return await services.get(url, {
        params: {
            start: start,
            limit: limit
        }
    });
}

export const postCreateComment = async (postId, content) => {
    return await services.post(`post/${postId}/comment`, {
        content
    });
}

export const postCreateReply = async (commentId, content) => {
    return await services.post(`comment/${commentId}/reply`, {
        content
    });
}

export const postLike = async (postId, emojiType) => {
    return await services.post(`post/${postId}/like`, {
        emojiType
    });
}

export const postDislike = async (postId) => {
    return await services.delete(`post/${postId}/dislike`);
}

export const fetchListLiked = async (postId, emojiType, start, limit) => {
    return await services.get(`post/${postId}/like`, {
        params: {
            emojiType,
            start,
            limit
        }
    });
}

export const fetchConversation = async (start, limit) => {
    return await services.get(`conversations`, {
        params: {
            start,
            limit
        }
    });
}

export const postCreateConversation = async (users, title, message) => {
    return await services.post(`conversations`, {
        users,
        title,
        message
    });
}

export const fetchConversationMessage = async (conversationId, start, limit) => {
    return await services.get(`/conversations/${conversationId}/messages`, {
        params: {
            start,
            limit
        }
    });
}

export const postCreateMessage = async (conversationId, message) => {
    return await services.post(`conversations/${conversationId}/messages`, {
        message
    });
}

export const postMarkReading = async (conversationId, messageId) => {
    return await services.get(`/conversations/${conversationId}/messages/${messageId}/reading`);
}

export const getLastRead = async (conversationId) => {
    return await services.get(`conversations/${conversationId}/last-read`);
}