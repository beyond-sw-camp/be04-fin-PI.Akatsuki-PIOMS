import { createRouter, createWebHistory } from 'vue-router';
import LogIn from "@/components/logIn/Login.vue";
import ProductList from "@/components/amdin/product/aaProductList.vue";
import CategoryList from "@/components/amdin/Category/CategoryList.vue";

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
        },
        {
            path: '/category',
            component: CategoryList
        }
    ]
});

export default router;
