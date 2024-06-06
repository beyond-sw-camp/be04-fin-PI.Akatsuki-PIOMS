import axios from 'axios';
import store from '@/store/store.js';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
    baseURL: 'http://api.pioms.shop',
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    async config => {
        const token = store.state.accessToken;

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    // 토큰 만료
                    await store.dispatch('reissueToken');
                    config.headers['Authorization'] = `Bearer ${store.state.accessToken}`;
                } else {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('토큰 처리 오류:', error);
                await store.dispatch('logout');
                throw new Error('토큰 처리 중 오류 발생');
            }
        }

        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            try {
                await store.dispatch('reissueToken');
                originalRequest.headers['Authorization'] = `Bearer ${store.state.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (e) {
                console.error('재발급 요청 중 오류 발생:', e);
                await store.dispatch('logout');
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
