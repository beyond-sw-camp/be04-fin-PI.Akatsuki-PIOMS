import { createRouter, createWebHistory } from 'vue-router';
import AskMain from "@/components/franchise/ask/AskMain.vue";
import AnswerFormEdit from "@/components/franchise/ask/AnswerFormEdit.vue";
import AnswerFormRegister from "@/components/franchise/ask/AnswerFormRegister.vue";

const routes = [
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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
