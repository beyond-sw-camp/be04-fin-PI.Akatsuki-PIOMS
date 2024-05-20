import { createRouter, createWebHistory } from 'vue-router';
import LogIn from "@/components/logIn/Login.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: LogIn
        },
    ]
});

export default router;
