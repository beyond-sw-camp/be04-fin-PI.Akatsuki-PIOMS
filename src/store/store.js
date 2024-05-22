import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isAuthenticated: false,
    },
    mutations: {
        setAuthentication(state, status) {
            state.isAuthenticated = status;
        },
    },
    actions: {
        login({ commit }, credentials) {
            // 로그인 API 호출
            // 성공 시:
            commit('setAuthentication', true);
        },
        logout({ commit }) {
            // 로그아웃 API 호출
            // 성공 시:
            commit('setAuthentication', false);
        },
    },
});
