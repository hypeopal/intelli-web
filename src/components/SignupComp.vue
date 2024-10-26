<template>
  <div class="login">
    <h2 style="text-align: center">注册</h2>
    <form @submit.prevent="handleSignup">
      <div class="input-group">
        <label for="username" class="login-label">用户名：</label>
        <input v-model="username" type="text" id="username" class="login-input"/>
      </div>
      <div class="input-group">
        <label for="password" class="login-label">密码：</label>
        <input v-model="password" type="password" id="password" class="login-input"/>
      </div>
      <div class="input-group">
        <label for="password" class="login-label">确认密码：</label>
        <input v-model="confirmPassword" type="password" id="password" class="login-input"/>
      </div>
      <button type="submit" class="login-button" :disabled="isLoading">注册</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import axios from "axios";
import {serverAddress} from "../../global";
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleSignup = async () => {
  if (username.value === '' || password.value === '') {
    errorMessage.value = '用户名或密码不能为空';
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致';
  } else {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await axios.post(serverAddress + '/api/signup', {
        username: username.value,
        password: password.value
      });

      if (response.data.message === "success") {
        alert('注册成功, 请登录');
        await router.push('/auth/login');
      } else {
        errorMessage.value = response.data.message;
      }
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      if (error.response.data.message === 'user already exist') {
        errorMessage.value = '用户已存在';
      } else{
        errorMessage.value = '注册请求失败，请稍后重试';
      }
    } finally {
      isLoading.value = false;
    }
  }
};
</script>

<style scoped>
@import "../css/login.css";
</style>
