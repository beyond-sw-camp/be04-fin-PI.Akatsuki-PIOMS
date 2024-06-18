import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axiosInstance from '@/axios-instance';
import router from '@/router/router.js';
import { jwtDecode } from 'jwt-decode';

const store = createStore({
    state: {
        accessToken: localStorage.getItem('accessToken') || '',
        refreshToken: '',
        userRole: '',
        username: '',
        userCode: '',
        isModalOpen: false,
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
        setUserCode(state, userCode) {
            state.userCode = userCode;
        },
        clearAuth(state) {
            state.accessToken = '';
            state.refreshToken = '';
            state.userRole = '';
            state.username = '';
            state.userCode = '';
            localStorage.removeItem('accessToken');
        },
        setModalOpen(state, isOpen) {
            state.isModalOpen = isOpen;
        }
    },
    actions: {
        login({ commit }, { accessToken }) {
            commit('setAccessToken', accessToken);

            const decodedToken = jwtDecode(accessToken);
            const userRole = decodedToken.role;
            const username = decodedToken.username;
            const userCode = decodedToken.usercode;
            commit('setUserRole', userRole);
            commit('setUsername', username);
            commit('setUserCode', userCode);
        },
        async reissueToken({ commit }) {
            try {
                const response = await axiosInstance.post('/reissue');
                const newAccessToken = response.data.split(' ')[1]; // 응답 바디에서 새 액세스 토큰 추출
                commit('setAccessToken', newAccessToken);

                const decodedToken = jwtDecode(newAccessToken);
                const userRole = decodedToken.role;
                const username = decodedToken.username;
                const userCode = decodedToken.usercode;
                commit('setUserRole', userRole);
                commit('setUsername', username);
                commit('setUserCode', userCode);
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
                router.push('/');
            }
        },
        initializeAuth({ commit }) {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                commit('setAccessToken', accessToken);

                const decodedToken = jwtDecode(accessToken);
                const userRole = decodedToken.role;
                const username = decodedToken.username;
                const userCode = decodedToken.usercode;
                commit('setUserRole', userRole);
                commit('setUsername', username);
                commit('setUserCode', userCode);
            }

            const refreshToken = getCookie('refreshToken');
            if (refreshToken) {
                commit('setRefreshToken', refreshToken);
            }
        }
    },
    getters: {
        isAuthenticated: state => !!state.accessToken,
        userRole: state => state.userRole,
        username: state => state.username,
        userCode: state => state.userCode,
        isModalOpen: state => state.isModalOpen,
    },
    plugins: [createPersistedState()],
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export default store;
