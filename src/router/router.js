import { createRouter, createWebHistory } from 'vue-router';
import AnswerFormRegister from "@/components/amdin/ask/AnswerFormRegister.vue";
import FranchiseLogin from "@/components/login/FranchiseLogin.vue";
import DriverLogin from "@/components/login/DriverLogin.vue";
import CommonLogin from "@/components/login/CommonLogin.vue";
import AskMain from "@/components/amdin/ask/AskMain.vue";
import AnswerFormEdit from "@/components/amdin/ask/AnswerFormEdit.vue";

import AdminLogin from "@/components/login/AdminLogin.vue";
import AskFormCreate from "@/components/franchise/ask/AskFormCreate.vue";
import AskFormView from "@/components/franchise/ask/AskFormView.vue";
import AskFRMain from "@/components/franchise/ask/AskFRMain.vue";
import AskFormEdit from "@/components/franchise/ask/AskFormEdit.vue";
import ProductList from "@/components/amdin/product/ProductList.vue";
import FrProductList from "@/components/franchise/product/FrProductList.vue";
import CategoryList from "@/components/amdin/Category/CategoryList.vue";
import OrderPage from '@/components/order/orderPage.vue';

import ExchangePage from '@/components/exchange/exchangePage.vue';

import PostCategory from "@/components/amdin/Category/PostCategory.vue";

import FavoriteRegister from "@/components/franchise/favorite/FavoriteRegister.vue";
import FavoriteList from "@/components/franchise/favorite/FavoriteList.vue";

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
        path: '/admin/ask',
        name: 'AskMain',
        component: AskMain
    },
    {
        path: '/admin/answerform/register',
        name: 'AnswerFormRegister',
        component: AnswerFormRegister
    },
    {
        path: '/admin/answerform/edit',
        name: 'AnswerFormEdit',
        component: AnswerFormEdit
    },
    {
        path: '/franchise/ask',
        name: 'AskFRMain',
        component: AskFRMain
    },
    {
        path: '/franchise/askform/edit',
        name: 'AskFromEdit',
        component: AskFormEdit
    },
    {
        path: '/franchise/askform/view',
        name: 'AskFormView',
        component: AskFormView
    },
    {
        path: '/franchise/askform/create',
        name: 'AskFormCreate',
        component: AskFormCreate
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
        path: '/franchise/product/list',
        name: 'FranchiseProductList',
        component: FrProductList
    },
    {
        path: '/admin/category/list',
        name: 'AdminProductCategoryList',
        component: CategoryList
    },
    {
        path: '/admin/category/post',
        name: 'AdminProductCategoryPost',
        component: PostCategory
    },
    {
        path: '/exchange/list',
        name: 'exchangeList',
        component: ExchangePage
    },
    {
        path: '/franchise/favorite/register',
        name: 'FranchiseFavoriteRegister',
        component: FavoriteRegister
    },
    {
        path: '/franchise/favorite/list',
        name: 'FranchiseFavoriteList',
        component: FavoriteList
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
