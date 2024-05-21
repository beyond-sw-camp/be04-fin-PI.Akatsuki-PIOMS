import { createRouter, createWebHistory } from 'vue-router';
import LogIn from "@/components/logIn/Login.vue";
import ProductList from "@/components/amdin/product/aaProductList.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: LogIn
        },
        {
            path: '/product',
            component: ProductList
        }
    ]
});

export default router;
