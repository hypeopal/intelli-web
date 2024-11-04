import {createI18n} from "vue-i18n";
import en from "./en.json";
import zh from "./zh.json";
import ja from "./ja.json";
import fr from "./fr.json";

const i18n = createI18n({
    locale: localStorage.getItem("lang") || navigator.language || 'zh', //首先加载用户设定的语言，然后浏览器语言，最后默认中文
    globalInjection: true,
    legacy: false,
    messages: {
        en,
        zh,
        ja,
        fr
    }
});

export const langList = [
    {value: 'zh-CN', label: '中文'},
    {value: 'en-US', label: 'English'},
    {value: 'ja-JP', label: '日本語'},
    {value: 'fr-FR', label: 'Français'},
];
export default i18n;