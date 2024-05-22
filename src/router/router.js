import { createRouter, createWebHistory } from 'vue-router';
import AskMain from "@/components/franchise/ask/AskMain.vue";
import LogIn from "@/components/logIn/Login.vue";
import ProductList from "@/components/amdin/product/aaProductList.vue";
import CategoryList from "@/components/amdin/Category/CategoryList.vue";

const routes = [
    {
        path: '/',
        name: 'AskMain',
        component: AskMain
    }
];

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
