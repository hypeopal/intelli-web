<template>
  <div class="login">
    <div class="back-arrow" @click="goToLogin">
      ← {{ t('back') }}
    </div>
    <h2 style="text-align: center">{{ t('signup') }}</h2>
    <form @submit.prevent="handleSignup">
      <div class="input-group">
        <input v-model="username" type="text" id="username" class="login-input" placeholder=""/>
        <label for="username" class="login-label">{{ t('username') }}</label>
      </div>
      <div class="input-group">
        <input v-model="password" type="password" id="password" class="login-input" placeholder=""/>
        <label for="password" class="login-label">{{ t('password') }}</label>
      </div>
      <div class="input-group">
        <input v-model="confirmPassword" type="password" id="password" class="login-input" placeholder=""/>
        <label for="password" class="login-label">{{ t('confirmPassword') }}</label>
      </div>
      <button type="submit" class="login-button" :disabled="isLoading"><div style="margin-left: 15%">{{ t('signup') }}</div></button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import axios from "axios";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";

const router = useRouter();
const {t} = useI18n();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleSignup = async () => {
  if (username.value === '' || password.value === '') {
    errorMessage.value = t('loginNotNull');
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = t('passwordNotSame');
  } else {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await axios.post('/api/signup', {
        username: username.value,
        password: password.value
      });

      if (response.data.message === "success") {
        alert(t('signupSuccess'));
        await router.push('/auth/login');
      } else {
        errorMessage.value = response.data.message;
      }
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      if (error.response.data.message === 'user already exist') {
        errorMessage.value = t('userAlreadyExist');
      } else {
        errorMessage.value = t('signupFailed');
      }
    } finally {
      isLoading.value = false;
    }
  }
};
const goToLogin = () => {
  router.push('/auth/login');
}
</script>

<style scoped>
@import "../css/login.css";
</style>
