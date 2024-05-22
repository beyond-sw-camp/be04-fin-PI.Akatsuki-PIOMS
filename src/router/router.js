import { createRouter, createWebHistory } from 'vue-router';
import ProductList from "@/components/amdin/product/ProductList.vue";
// import CategoryList from "@/components/amdin/Category/CategoryList11.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '',
            name: 'AdminProductList11',
            component: ProductList
        }/*,
        {
            path: '/category',
            name: 'CategoryList',
            component: CategoryList
        }*/
    ]
});

export default router;
