<template>
  <div class="login">
    <div class="back-arrow" @click="goToLogin">
      ← {{t('back')}}
    </div>
    <h2 style="text-align: center">{{ t('findPassword') }}</h2>
    <form @submit.prevent="handleFind">
      <div class="input-group">
        <label for="username" class="login-label">{{t('username')}}：</label>
        <input v-model="username" type="text" id="username" class="login-input"/>
      </div>
      <div class="input-group">
        <label for="password" class="login-label">{{t('password')}}：</label>
        <input v-model="password" type="password" id="password" class="login-input"/>
      </div>
      <button type="submit" class="login-button" :disabled="isLoading">{{t('findPassword')}}</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";

const router = useRouter();
const {t} = useI18n();

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleFind = async () => {};
const goToLogin = () => {
  router.push('/auth/login');
};
</script>

<style scoped>
@import "../css/login.css";
</style>