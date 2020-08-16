import axios from 'axios';

const API_URL = "http://localhost:3000/v1";
const services = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    timeoutErrorMessage: "Request Timeout"
});

services.interceptors.request.use(function (config) {
    config.headers.common['token'] = localStorage.getItem('accessToken');
    return config;
}, function (error) {
    console.log(error);
    return Promise.reject(error);
});

services.interceptors.response.use(function (response) {
    console.log("SUC Resp: ", response.data);
    return response.data;
}, function (error) {
    if(error.response){
        console.log("ERR Resp: ", error.response);
        if(error.response.status === 419){
            console.log("Token Timeout");
        }
        return Promise.reject(error.response);
    }
    console.log("Err: ", error);
    return Promise.reject(error);
});

export default services;