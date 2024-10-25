<template>
  <div class="login">
    <h2 style="text-align: center">找回密码</h2>
    <form @submit.prevent="handleFind">
      <div class="input-group">
        <label for="username" class="login-label">用户名：</label>
        <input v-model="username" type="text" id="username" class="login-input"/>
      </div>
      <div class="input-group">
        <label for="password" class="login-label">密码：</label>
        <input v-model="password" type="password" id="password" class="login-input"/>
      </div>
      <button type="submit" class="login-button" :disabled="isLoading">找回</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import {ref} from "vue";

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleFind = async () => {};
</script>

<style scoped>
@import "../css/login.css";
</style>