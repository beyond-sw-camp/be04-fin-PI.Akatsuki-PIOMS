import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/store.js';
import Swal from 'sweetalert2';

import FranchiseLogin from "@/components/login/FranchiseLogin.vue";
import DriverLogin from "@/components/login/DriverLogin.vue";
import CommonLogin from "@/components/login/CommonLogin.vue";
import AskMain from "@/components/amdin/ask/AskMain.vue";
import AdminLogin from "@/components/login/AdminLogin.vue";
import AskFRMain from "@/components/franchise/ask/AskFRMain.vue";
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
import DriverMemberPage from "@/components/amdin/member/DriverList.vue";
import FrOwnerMemberPage from "@/components/franchise/member/FranchiseOwnerList.vue";
import FranchiseList from "@/components/franchise/FranchiseList.vue";

const routes = [
    {
        path: '/admin/login',
        name: '관리자로그인',
        component: AdminLogin,
    },
    {
        path: '/franchise/login',
        name: '점주로그인',
        component: FranchiseLogin,
    },
    {
        path: '/driver/login',
        name: '배송기사로그인',
        component: DriverLogin,
    },
    {
        path: '/',
        name: '통합로그인',
        component: CommonLogin,
    },
    {
        path: '/admin/ask/list',
        name: '관리자문의사항목록',
        component: AskMain,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/franchise/ask/list',
        name: '점주문의사항목록',
        component: AskFRMain,
        meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/admin/order/list',
        name: '관리자발주확인목록',
        component: AdminOrderPage,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/franchise/order/list',
        name: '점주발주신청목록',
        component: FranchiseOrderPage,
        meta: { requiresAuth: true, role: ['ROLE_OWNER', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/product/list',
        name: '관리자상품목록',
        component: ProductList,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/franchise/product/list',
        name: '점주본사상품목록',
        component: FrProductList,
        meta: { requiresAuth: true, role: ['ROLE_ROOT', 'ROLE_OWNER'] }
    },
    {
        path: '/admin/category/list',
        name: '관리자카테고리목록',
        component: CategoryList,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/category/registration',
        name: '관리자카테고리등록',
        component: PostCategory,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/franchise/list',
        name: '관리자가맹점목록',
        component: FranchiseList,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/franchise/exchange/list',
        name: '점주반품신청목록',
        component: FranchiseExchangePage,
        meta: { requiresAuth: true, role: ['ROLE_OWNER', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/exchange/list',
        name: '관리자반품처리목록',
        component: AdminExchangePage,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/notice/list',
        name: '관리자공지목록',
        component: NoticeList,
        meta: { requiresAuth: true, role: ['ROLE_ROOT', 'ROLE_ADMIN'] }
    },
    {
        path: '/franchise/notice/list',
        name: '점주공지목록',
        component: NoticeListFrOwner,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_OWNER'] }
    },
    {
        path: '/franchise/favorite/register',
        name: '점주즐겨찾기신청',
        component: FavoriteRegister,
        meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/franchise/favorite/list',
        name: '점주즐겨찾기목록',
        component: FavoriteList,
        meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/admin/driver/list',
        name: '관리자배송기사관리목록',
        component: DriverMemberPage,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/log/list',
        name: '관리자이력목록',
        component: Log,
        meta: { requiresAuth: true, role: 'ROLE_ROOT' }
    },
    {
        path: '/driver/home',
        name: '배송기사대시보드',
        component: DriverDashBoard,
        meta: { requiresAuth: true, preventBack: true, role: 'ROLE_DRIVER' }
    },
    {
        path: '/franchise/home',
        name: '점주대시보드',
        component: FranchiseDashBoard,
        meta: { requiresAuth: true, preventBack: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/franchise/warehouse/list',
        name: '점주창고목록',
        component: FrWarehousePage,
        meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
        path: '/admin/home',
        name: '관리자대시보드',
        component: AdminDashBoard,
        meta: { requiresAuth: true, preventBack: true, role: ['ROLE_ROOT', 'ROLE_ADMIN'] }
    },
    {
        path: '/admin/owner/list',
        name: '관리자점주관리목록',
        component: FrOwnerMemberPage,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/admin/list',
        name: '루트관리자관리목록',
        component: AdminMembers,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
    },
    {
        path: '/admin/invoices/list',
        name: '관리자배송목록',
        component: AdminInvoice,
        meta: { requiresAuth: true, role: ['ROLE_ADMIN', 'ROLE_ROOT'] }
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

    // 접근 시 토큰이 있는 경우 리다이렉션 처리
    if (['/', '/admin/login', '/franchise/login', '/driver/login'].includes(to.path)) {
        if (isAuthenticated) {
            switch (userRole) {
                case 'ROLE_ROOT':
                case 'ROLE_ADMIN':
                    return next({ name: '관리자대시보드' });
                case 'ROLE_OWNER':
                    return next({ name: '점주대시보드' });
                case 'ROLE_DRIVER':
                    return next({ name: '배송기사대시보드' });
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
                next({ path: '/' });
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
