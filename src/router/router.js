import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/store.js';
import Swal from 'sweetalert2';

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
import Log from "@/components/log/Log.vue";
import NoticeList from "@/components/notice/NoticeList.vue";
import FranchiseDashBoard from "@/components/franchise/FranchiseDashBoard.vue";
import DriverDashBoard from "@/components/driver/DriverDashBoard.vue";
import NoticeListFrOwner from "@/components/notice/NoticeListFrOwner.vue";
import FrWarehousePage from "@/components/franchise/warehouse/FrWarehousePage.vue";
import AdminDashBoard from "@/components/amdin/dashboard/AdminDashBoard.vue";


import AdminInvoice from '@/components/amdin/invoice/AdminInvoice.vue';

import AdminMembers from "@/components/amdin/member/AdminMemberPage.vue";
import DriverMemberPage from "@/components/amdin/member/DriverMemberPage.vue";
import FrOwnerMemberPage from "@/components/franchise/member/FrOwnerMemberPage.vue";

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
        component: FranchiseOrderPage,
        meta: { requiresAuth: true, role: ['ROLE_OWNER', 'ROLE_ROOT'] }
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
        meta: { requiresAuth: true, role: ['ROLE_ROOT', 'ROLE_OWNER'] }
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
        name: 'NoticeList',
        component: NoticeList,
        meta: { requiresAuth: true, role: ['ROLE_ROOT','ROLE_ADMIN'] }
    },
    {
        path: '/franchise/notice/list',
        name: 'FranchiseNoticeList',
        component: NoticeListFrOwner,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_OWNER'] }
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
        path: '/admin/drivers',
        name: 'DriverMemberList',
        component: DriverMemberPage
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
        meta: { requiresAuth: true, preventBack: true, role: 'ROLE_DRIVER' }
    },
    {
        path: '/franchise/home',
        name: 'FranchiseDashBoard',
        component: FranchiseDashBoard,
        meta: { requiresAuth: true, preventBack: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/franchise/warehouse',
        name: 'FranchiseWarehouse',
        component: FrWarehousePage
    },
    {
        path: '/admin/home',
        name: 'AdminDashBoard',
        component: AdminDashBoard,
        meta: { requiresAuth: true, preventBack: true, role: ['ROLE_ROOT', 'ROLE_ADMIN'] }
    },
    {
        path: '/admin/owners',
        name: 'FrOwnerMemberPage',
        component: FrOwnerMemberPage
    },
    {
        path: '/admin/admins',
        name: 'AdminMemberList',
        component: AdminMembers
    },
    {
        path: '/admin/invoices',
        name: 'AdminInvoiceList',
        component: AdminInvoice
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

    // 나쁜사람들이 하는 행위 -> 접근 시 토큰이 있는 경우 리다이렉션 처리
    if (['/', '/admin/login', '/franchise/login', '/driver/login'].includes(to.path)) {
        if (isAuthenticated) {
            switch (userRole) {
                case 'ROLE_ROOT':
                case 'ROLE_ADMIN':
                    return next({ name: 'AdminDashBoard' });
                case 'ROLE_OWNER':
                    return next({ name: 'FranchiseDashBoard' });
                case 'ROLE_DRIVER':
                    return next({ name: 'DriverDashboard' });
            }
        }
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            Swal.fire({
                icon: 'warning',
                title: '접근 거부',
                text: '로그인이 필요합니다.',
                confirmButtonText: '확인'
            }).then(() => {
                next({ name: 'CommonLogin' });
            });
        } else {
            const requiredRoles = to.meta.role;
            if (requiredRoles && !requiredRoles.includes(userRole)) {
                // 사용자가 해당 경로에 접근할 권한이 없는 경우
                Swal.fire({
                    icon: 'warning',
                    title: '접근 거부',
                    text: '이 페이지에 접근할 권한이 없습니다.',
                    confirmButtonText: '확인'
                }).then(() => {
                    next(false);
                });
            } else {
                next();
            }
        }
    } else {
        next();
    }
});

window.addEventListener('popstate', (event) => {
    const currentRoute = router.currentRoute.value;
    if (currentRoute.meta.preventBack) {
        Swal.fire({
            icon: 'warning',
            title: '경고',
            text: '이 페이지에서 뒤로 갈 수 없습니다.',
            confirmButtonText: '확인'
        }).then(() => {
            window.history.pushState(null, null, window.location.href);
        });
    }
});

router.afterEach((to) => {
    if (to.meta.preventBack) {
        window.history.pushState(null, null, window.location.href);
    }
});

export default router;
