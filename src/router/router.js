import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/store.js'; // Vuex 스토어 임포트

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
import AdminOrderPage from '@/components/order/AdminOrderPage.vue';
import FranchiseOrderPage from '@/components/order/FranchiseOrderPage.vue';
import AdminExchangePage from '@/components/exchange/AdminExchangePage.vue';
import FranchiseExchangePage from '@/components/exchange/FranchiseExchangePage.vue';
import PostCategory from "@/components/amdin/Category/PostCategory.vue";
import FavoriteRegister from "@/components/franchise/favorite/FavoriteRegister.vue";
import FavoriteList from "@/components/franchise/favorite/FavoriteList.vue";
import AdminMembers from "@/components/amdin/member/AdminMemberPage.vue";
import Log from "@/components/log/Log.vue";
import NoticeList from "@/components/notice/NoticeList.vue";
import FranchiseDashBoard from "@/components/franchise/FranchiseDashBoard.vue";
import DriverDashBoard from "@/components/driver/DriverDashBoard.vue";


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
        path: '/',
        name: 'CommonLogin',
        component: CommonLogin,
    },
    {
        path: '/admin/ask',
        name: 'AskMain',
        component: AskMain,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/answerform/register',
        name: 'AnswerFormRegister',
        component: AnswerFormRegister,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/answerform/edit',
        name: 'AnswerFormEdit',
        component: AnswerFormEdit,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/franchise/ask',
        name: 'AskFRMain',
        component: AskFRMain,
        meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/franchise/askform/edit',
        name: 'AskFromEdit',
        component: AskFormEdit,
        meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/franchise/askform/view',
        name: 'AskFormView',
        component: AskFormView,
        meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/franchise/askform/create',
        name: 'AskFormCreate',
        component: AskFormCreate,
        meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/admin/order/list',
        name: 'AdminOrderList',
        component: AdminOrderPage,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/franchise/order/list',
        name: 'FranchiseOrderList',
        component: FranchiseOrderPage
        ,meta: { requiresAuth: true, role: ['ROLE_OWNER', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/product/list',
        name: 'AdminProductList',
        component: ProductList,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/franchise/product/list',
        name: 'FranchiseProductList',
        component: FrProductList,
        meta: { requiresAuth: true, role: 'ROLE_ROOT' }
    },
    {
        path: '/admin/category/list',
        name: 'AdminProductCategoryList',
        component: CategoryList,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/category/post',
        name: 'AdminProductCategoryPost',
        component: PostCategory,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/franchise/exchange/list',
        name: 'FranchiseExchangeList',
        component: FranchiseExchangePage,
        meta: { requiresAuth: true, role: ['ROLE_OWNER', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/exchange/list',
        name: 'AdminExchangeList',
        component: AdminExchangePage,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/notice/list',
        name: 'noticeList',
        component: NoticeList,
        meta: { requiresAuth: true, role: 'ROLE_ROOT' }
    },
    {
        path: '/franchise/favorite/register',
        name: 'FranchiseFavoriteRegister',
        component: FavoriteRegister,
        meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/franchise/favorite/list',
        name: 'FranchiseFavoriteList',
        component: FavoriteList,
        meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {

        path: '/admin/members',
        name: 'AdminMemberList',
        component: AdminMembers
    },
    {
        path: '/admin/logs',
        name: 'AdminLogs',
        component: Log,
        meta: { requiresAuth: true, role: 'ROLE_ROOT' }
    },
    {
        path: '/driver/home',
        name: 'DriverDashboard',
        component: DriverDashBoard,
        meta: { requiresAuth: true, role: 'ROLE_DRIVER' }
    },
    {
        path: '/franchise/home',
        name: 'FranchiseDashBoard',
        component: FranchiseDashBoard
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 네비게이션 가드 설정
router.beforeEach(async (to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated;
    const userRole = store.getters.userRole;

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next({ name: 'CommonLogin' });
        } else {
            const requiredRoles = to.meta.role;
            if (requiredRoles && !requiredRoles.includes(userRole)) {
                // 사용자가 해당 경로에 접근할 권한이 없는 경우
                next({ name: 'CommonLogin' });
            } else {
                next();
            }
        }
    } else {
        next();
    }
});

export default router;
