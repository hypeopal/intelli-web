<template>
  <div>
    <h2>{{ t('overview') }}</h2>
  </div>
  <div>
    <weather-chart/>
  </div>
</template>

<script setup>
import WeatherChart from "../components/WeatherChart.vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
</script>
