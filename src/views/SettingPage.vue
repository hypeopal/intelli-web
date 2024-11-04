<template>
  <div class="setting-page">
    <div class="setting-section">
      <h2>{{t('setting')}}</h2>
      <div class="lang-choose">
        {{t('language')}}:
        <el-select v-model="locale" style="width: 120px" @change="changeLang">
          <el-option v-for="item in langList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {langList} from "../locales/i18n.js";

const {t, locale} = useI18n();

const changeLang = () => {
  localStorage.setItem('lang', locale.value);
}
</script>

<style scoped>
@import "../css/setting.css";
</style>