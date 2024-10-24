import {createRouter, createWebHistory} from 'vue-router';
import AuthPage from '../components/AuthPage.vue';
import HomePage from '../components/HomePage.vue';
import SignupComp from '../components/SignupComp.vue';
import OverviewPage from "../views/OverviewPage.vue";
import ScenePage from "../views/ScenePage.vue";
import FindPassword from "../components/FindPassword.vue";
import DevicePage from "../views/DevicePage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import SettingPage from "../views/SettingPage.vue";
import LoginComp from "../components/LoginComp.vue";

const routes = [
    {path: '/', redirect: '/home/overview'},
    {
        path: '/auth',
        component: AuthPage,
        children: [
            {path: 'login', component: LoginComp},
            {path: 'signup', component: SignupComp},
            {path: 'findpassword', component: FindPassword},
        ]
    },
    {
        path: '/home',
        component: HomePage,
        meta: {requiresAuth: true},
        children: [
            {path: 'overview', component: OverviewPage},
            {path: 'scene', component: ScenePage},
            {path: 'device', component: DevicePage},
            {path: 'profile', component: ProfilePage},
            {path: 'setting', component: SettingPage},
        ]
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            next('/auth/login');
        } else {
            next();
        }
    } else {
        next();
    }
});
export default router;