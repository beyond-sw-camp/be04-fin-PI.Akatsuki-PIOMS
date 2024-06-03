import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { jwtDecode } from "jwt-decode";
import axiosInstance from '@/axios-instance'; // Axios 인스턴스를 임포트합니다.
import router from '@/router/router.js'; // 라우터를 임포트합니다.

const store = createStore({
    state: {
        accessToken: localStorage.getItem('accessToken') || '',
        refreshToken: '',
        userRole: '',
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
        clearAuth(state) {
            state.accessToken = '';
            state.refreshToken = '';
            state.userRole = '';
            localStorage.removeItem('accessToken');
        }
    },
    actions: {
        login({ commit }, { accessToken, refreshToken }) {
            commit('setAccessToken', accessToken);
            commit('setRefreshToken', refreshToken);

            const decodedToken = jwtDecode(accessToken);
            const userRole = decodedToken.role;
            commit('setUserRole', userRole);
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
                router.push({ name: 'CommonLogin' }); // 로그아웃 후 로그인 선택창으로 이동
            }
        },
        initializeAuth({ commit }) {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                commit('setAccessToken', accessToken);

                const decodedToken = jwtDecode(accessToken);
                const userRole = decodedToken.role;
                commit('setUserRole', userRole);
            }
        }
    },
    getters: {
        isAuthenticated: state => !!state.accessToken,
        userRole: state => state.userRole,
    },
    plugins: [createPersistedState()],
});

export default store;
