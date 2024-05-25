import { createRouter, createWebHistory } from 'vue-router';


import AnswerFormRegister from "@/components/amdin/ask/AnswerFormRegister.vue";
import AdminLogin from "@/components/login/AdminLogin.vue";
import FranchiseLogin from "@/components/login/FranchiseLogin.vue";
import DriverLogin from "@/components/login/DriverLogin.vue";
import CommonLogin from "@/components/login/CommonLogin.vue";
import AskMain from "@/components/amdin/ask/AskMain.vue";
import AnswerFormEdit from "@/components/amdin/ask/AnswerFormEdit.vue";
import ProductList from "@/components/amdin/product/ProductList.vue";

import OrderPage from '@/components/order/orderPage.vue';

import ExchangePage from '@/components/exchange/exchangePage.vue';



const routes = [
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: AdminLogin,
    },
    {
        path: '/franchise/login',
        name: 'FranchiseLogin',
        component: FranchiseLogin,
    },
    {
        path: '/driver/login',
        name: 'DriverLogin',
        component: DriverLogin,
    },
    {
        path: '/login',
        name: 'CommonLogin',
        component: CommonLogin,
    },
    {
        path: '/',
        name: 'AskMain',
        component: AskMain
    },
    {
        path: '/admin/answerform/register',
        name: 'AnswerFormRegister',
        component: AnswerFormRegister // 답변 작성 폼 경로 설정
    },
    {
        path: '/admin/answerform/edit',
        name: 'AnswerFormEdit',
        component: AnswerFormEdit
    },
    {
        path: '/order/list',
        name: 'orderList',
        component: OrderPage
    },
    {
        path: '/admin/product/list',
        name: 'AdminProductList',
        component: ProductList
    },
    {
        path: '/exchange/list',
        name: 'exchangeList',
        component: ExchangePage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
