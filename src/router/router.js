import { createRouter, createWebHistory } from 'vue-router';
import AskMain from "@/components/franchise/ask/AskMain.vue";

const routes = [
    {
        path: '/',
        name: 'AskMain',
        component: AskMain
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
