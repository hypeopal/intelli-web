import {onMounted, ref} from 'vue';

export function useTheme() {
    const theme = ref('light'); // 当前主题
    const userTheme = ref('light'); // 用户选择的主题，可以是 light、dark 或 auto

    // 设置主题
    const setTheme = (newTheme) => {
        userTheme.value = newTheme; // 存储用户选择的主题
        if (newTheme === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            theme.value = mediaQuery.matches ? 'dark' : 'light';
        } else {
            theme.value = newTheme;
        }
        localStorage.setItem('userTheme', newTheme); // 将用户选择的主题存储在 localStorage 中
        document.documentElement.setAttribute('class', theme.value);
    };

    // 在页面加载时检查 localStorage 是否有保存的主题设置
    onMounted(() => {
        const savedUserTheme = localStorage.getItem('userTheme') || 'auto'; // 默认值为 auto
        userTheme.value = savedUserTheme;
        setTheme(savedUserTheme); // 初始化时设置主题
    });

    return {
        theme,
        userTheme,
        setTheme
    };
}
