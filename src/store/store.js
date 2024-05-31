import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { jwtDecode } from "jwt-decode";

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
        logout({ commit }) {
            commit('clearAuth');
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
