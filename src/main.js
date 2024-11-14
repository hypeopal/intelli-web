import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";
import i18n from "/src/locales/i18n.js";
import '/src/css/theme.css';
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App);

app.use(i18n);

app.use(Particles, {
    init: async engine => {
        await loadSlim(engine);
    }
});

app.use(router);

app.mount('#app');
