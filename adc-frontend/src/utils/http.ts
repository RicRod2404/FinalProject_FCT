import axios, {InternalAxiosRequestConfig, AxiosResponse} from "axios";
import store from "../store";
import {logout, resetToken} from "../store/session";


//const ip : string = "http://localhost:8080/";
const ip : string = "https://treapapp.ew.r.appspot.com/";


axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        config.headers["Authorization"] = store.getState().session.token;
        config.headers["Accept-Language"] = store.getState().config.lang;
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (resp: AxiosResponse) => {
        const token = resp.headers["authorization"];
        if (token) store.dispatch(resetToken(token));
        return resp;
    },
    (error) => {
        if (error.response.status === 418) {
            store.dispatch(logout());
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

axios.defaults.baseURL = ip + "rest/";

async function httpPost<T>(
    url: string,
    data: T
): Promise<AxiosResponse<T | null>> {
    try {
        return await axios.post(url, data);
    } catch (err: any) {
        throw err.response;
    }
}

async function httpPut<T>(
    url: string,
    data: T
): Promise<AxiosResponse<T | null>> {
    try {
        return await axios.put(url, data);
    } catch (err: any) {
        throw err.response;
    }
}

async function httpDelete<T>(url: string): Promise<AxiosResponse<T>> {
    try {
        return await axios.delete(url);
    } catch (err: any) {
        throw err.response;
    }
}

async function httpGet<T>(
    url: string,
    params?: object
): Promise<AxiosResponse<T>> {
    try {
        return await axios.get(url, {params: params});
    } catch (err: any) {
        throw err.response;
    }
}


export {httpPost, httpPut, httpDelete, httpGet};
