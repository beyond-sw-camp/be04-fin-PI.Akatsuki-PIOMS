import axios from 'axios';
import store from '@/store/store.js';
import {jwtDecode} from 'jwt-decode';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    async config => {
        const token = store.state.accessToken;

        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                // 토큰 만료
                try {
                    await store.dispatch('reissueToken');
                    config.headers['Authorization'] = `Bearer ${store.state.accessToken}`;
                } catch (error) {
                    console.error('토큰 재발급 실패:', error);
                    await store.dispatch('logout');
                }
            } else {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return config;
    },
    error => Promise.reject(error)
);

export default axiosInstance;
