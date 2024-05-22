import { createRouter, createWebHistory } from 'vue-router';

import AnswerFormRegister from "@/components/amdin/ask/AnswerFormRegister.vue";
import AdminLogin from "@/components/login/AdminLogin.vue";
import FranchiseLogin from "@/components/login/FranchiseLogin.vue";
import DriverLogin from "@/components/login/DriverLogin.vue";
import CommonLogin from "@/components/login/CommonLogin.vue";
import AskMain from "@/components/amdin/ask/AskMain.vue";
import AnswerFormEdit from "@/components/amdin/ask/AnswerFormEdit.vue";




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
        path: '',
        name: 'AdminProductList11',
        component: ProductList
    }
];
import ProductList from "@/components/amdin/product/ProductList.vue";

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
