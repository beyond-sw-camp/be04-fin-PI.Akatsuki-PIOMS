import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '@/axios-instance';
import router from '@/router/router.js';

const store = createStore({
    state: {
        accessToken: localStorage.getItem('accessToken') || '',
        refreshToken: '',
        userRole: '',
        username: '',
    },
    mutations: {
        setAccessToken(state, token) {
            state.accessToken = token;
            localStorage.setItem('accessToken', token);
        },
        setRefreshToken(state, token) {
            state.refreshToken = token;
        },
        setUserRole(state, role) {
            state.userRole = role;
        },
        setUsername(state, username) {
            state.username = username;
        },
        clearAuth(state) {
            state.accessToken = '';
            state.refreshToken = '';
            state.userRole = '';
            state.username = '';
            localStorage.removeItem('accessToken');
        }
    },
    actions: {
        login({ commit }, { accessToken, refreshToken }) {
            commit('setAccessToken', accessToken);
            commit('setRefreshToken', refreshToken);

            const decodedToken = jwtDecode(accessToken);
            const userRole = decodedToken.role;
            const username = decodedToken.username;
            commit('setUserRole', userRole);
            commit('setUsername', username);
        },
        async reissueToken({ commit, state }) {
            try {
                const response = await axiosInstance.post('/reissue');
                const newAccessToken = response.headers['authorization'].split(' ')[1];
                commit('setAccessToken', newAccessToken);
            } catch (error) {
                console.error('토큰 재발급 실패:', error);
                throw error;
            }
        },
        async logout({ commit }) {
            try {
                await axiosInstance.post('/logout');
            } catch (error) {
                console.error('로그아웃 요청 중 오류 발생:', error);
            } finally {
                commit('clearAuth');
                router.push({ name: 'CommonLogin' });
            }
        },
        initializeAuth({ commit }) {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                commit('setAccessToken', accessToken);

                const decodedToken = jwtDecode(accessToken);
                const userRole = decodedToken.role;
                const username = decodedToken.username;
                commit('setUserRole', userRole);
                commit('setUsername', username);
            }
        }
    },
    getters: {
        isAuthenticated: state => !!state.accessToken,
        userRole: state => state.userRole,
        username: state => state.username,
    },
    plugins: [createPersistedState()],
});

export default store;
