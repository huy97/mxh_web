import cogoToast from 'cogo-toast';

export function timeSince(date, type = 1) {
    //type 1 - post/comment
    //type 2 - online status
    date = new Date(date);
    var seconds = Math.floor((new Date() - date.getTime()) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " năm trước";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " tháng trước";
    }
    interval = seconds / 604800;
    if (interval > 1) {
        return Math.floor(interval) + " tuần trước";
    }

    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " ngày trước";
    }

    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " giờ trước";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " phút trước";
    }
    if(type === 1)
        return "Vừa xong";
    return Math.floor(seconds) + " giây trước";
}

export const toast = {
    error: (message, options) => {
        return cogoToast.error(message, {position: 'top-right', hideAfter: 5, ...options});
    },
    success: (message, options) => {
        return cogoToast.success(message, {position: 'top-right', hideAfter: 5, ...options});
    },
    info: (message, options) => {
        return cogoToast.info(message, {position: 'top-right', hideAfter: 5, ...options});
    },
    warn: (message, options) => {
        return cogoToast.warn(message, {position: 'top-right', hideAfter: 5, ...options});
    },
    loading: (message, options) => {
        return cogoToast.loading(message, {position: 'top-right', hideAfter: 5, ...options});
    }
}