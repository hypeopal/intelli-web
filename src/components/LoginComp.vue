<template>
  <div class="login">
    <h2 style="text-align: center; font-size: 35px;margin: 0 0 ;user-select: none">{{ t('welcome') }}</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="input-group">
        <input v-model.lazy="username" type="text" id="username" class="login-input" placeholder=""/>
        <label for="username" class="login-label">{{ t('username') }}</label>
      </div>
      <div class="input-group">
        <input v-model.lazy="password" type="password" id="password" class="login-input" placeholder=""/>
        <label for="password" class="login-label">{{ t('password') }}</label>
      </div>
      <button class="login-button" id="login-button">
        <div style="margin-left: 15%">{{ t('login') }}</div>
        <div class="icon">
          <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path
                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                fill="currentColor"
            ></path>
          </svg>
        </div>
      </button>
    </form>
    <div class="help-info">
      <span>{{ t('noAccount') }}<router-link to="/auth/signup">{{ t('signup') }}</router-link></span>
      <router-link to="/auth/findpassword">{{ t('findPassword') }}</router-link>
    </div>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {ElLoading, ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
import api from "../js/request.js";
import "element-plus/es/components/loading/style/css.mjs";

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();
const {t} = useI18n();

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = t('loginNotNull');
    return;
  }
  const loadingInstance = ElLoading.service({target: document.getElementById("login-button")});
  errorMessage.value = '';

  api.post('/api/login', {
    username: username.value,
    password: password.value
  }, {noAuth: true}).then((response) => {
    if (response.message === "success") {
      // 登录成功，设置登录状态
      localStorage.setItem('username', username.value);
      localStorage.setItem('token', response.data.token);

      ElMessage({
        message: t('loginSuccess'),
        type: 'success'
      });
      loadingInstance.close();
      // 跳转到主界面
      router.push('/');
    } else {
      if (response.message === '用户名不存在') {
        errorMessage.value = t('userNotExist');
      }
    }
    loadingInstance.close();
  }).catch((error) => {
    errorMessage.value = t('loginFailed');
    loadingInstance.close();
  });
};
</script>

<style scoped>
@import "../css/login.css";
</style>
