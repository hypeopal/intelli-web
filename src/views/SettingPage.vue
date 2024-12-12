<template>
  <div class="setting-page">
    <div class="setting-section">
      <h2>{{ t('setting') }}</h2>
      <div class="lang-choose">
        {{ t('language') }}:
        <el-select v-model="locale" style="width: 120px" @change="changeLang">
          <el-option v-for="item in langList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </div>
      <div>
        {{ t('theme') }}:
        <el-radio-group v-model="userTheme" @change="setTheme(userTheme)">
          <el-radio value="light">{{ t('lightTheme') }}</el-radio>
          <el-radio value="dark">{{ t('dark') }}</el-radio>
          <el-radio value="auto">{{ t('autoTheme') }}</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 10px;">
        <button class="about-btn" @click="showAboutModal = true">{{t('about')}}</button>
      </div>
      <el-dialog v-model="showAboutModal"
                 width="200"
                 align-center
      >
        <template #header>
          {{t('about')}}
        </template>
        {{t('aboutMessage')}}
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import {ref, inject} from 'vue';
import {useI18n} from "vue-i18n";
import {langList} from "../locales/i18n.js";
import {useTheme} from "../js/UseTheme.js";
const {t, locale} = useI18n();
const {theme, userTheme, setTheme} = useTheme();
const showAboutModal = ref(false);

const updateWeather = inject('updateWeather');
const changeLang = () => {
  localStorage.setItem('lang', locale.value);
  updateWeather();
}
</script>

<style scoped>
@import "../css/setting.css";
</style>