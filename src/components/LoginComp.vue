<template>
  <div class="login">
    <h2 style="text-align: center; font-size: 35px;margin: 0 0 15px;user-select: none">{{ t('welcome') }}</h2>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="username" class="login-label">{{ t('username') }}：</label>
        <input v-model.lazy="username" type="text" id="username" class="login-input"/>
      </div>
      <div class="input-group">
        <label for="password" class="login-label">{{ t('password') }}：</label>
        <input v-model.lazy="password" type="password" id="password" class="login-input"/>
      </div>
      <button type="submit" class="login-button" :disabled="isLoading">{{ t('login') }}</button>
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
import axios from 'axios';
import {serverAddress} from '../../global';
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const router = useRouter();
const {t} = useI18n();

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = t('loginNotNull');
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.post(serverAddress + '/api/login', {
      username: username.value,
      password: password.value
    });

    if (response.data.message === "success") {
      // 登录成功，设置登录状态
      localStorage.setItem('username', username.value);
      localStorage.setItem('token', response.data.data.token);

      ElMessage({
        message: t('loginSuccess'),
        type: 'success'
      });
      // 跳转到主界面
      await router.push('/');
    } else {
      if (response.data.message === '用户名不存在') {
        errorMessage.value = t('userNotExist');
      }
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = t('loginFailed');
  } finally {
    isLoading.value = false;
  }
};
</script>


<style scoped>
@import "../css/login.css";
</style>
