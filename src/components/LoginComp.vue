<template>
  <div class="login">
    <h2 style="text-align: center; font-size: 30px">登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="username" class="login-label">用户名：</label>
        <input v-model="username" type="text" id="username" class="login-input"/>
      </div>
      <div class="input-group">
        <label for="password" class="login-label">密码：</label>
        <input v-model="password" type="password" id="password" class="login-input"/>
      </div>
      <button type="submit" class="login-button" :disabled="isLoading">登录</button>
    </form>
    <div style="font-size: 20px">
      <span>没有账号？</span>
      <router-link to="/auth/signup">立即注册</router-link>
      <router-link to="/auth/findpassword" style="margin-left: 140px">找回密码</router-link>
    </div>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import {serverAddress} from "../../global";

export default {
  name: 'LoginComp',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isLoading: false,
    };
  },
  methods: {
    async handleLogin() {
      if (!this.username || !this.password) {
        this.errorMessage = '用户名和密码不能为空';
        return;
      }
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const response = await axios.post(serverAddress + '/api/login', {
          username: this.username,
          password: this.password
        });

        if (response.data.message === "success") {
          // 登录成功，设置登录状态
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('username', this.username);
          localStorage.setItem('token', response.data.data.token);
          // 跳转到主界面
          this.$router.push('/');
        } else {
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = '登录请求失败，请稍后重试';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
@import "../css/login.css";
</style>
