<template>
  <div class="profile-container">
    <div class="profile-section">
      <h2 class="profile-title">个人中心</h2>
      <el-cascader v-model="city" :options="data" :props="props" @change="handleChange" placeholder="选择城市" class="city-selector" />
      <el-button v-if="modified" type="primary" class="submit-button" :loading="isLoading" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import data from "../assets/City.json";

const city = ref([]);
const modified = ref(false);
const isLoading = ref(false);
let id = 0;
const props = {
  expandTrigger: 'hover',
};
const handleChange = (value) => {
  modified.value = true;
  console.log(value);
};
const handleSubmit = () => {
  isLoading.value = true;
  setTimeout(() => {
    console.log('提交的数据:', city.value);
    modified.value = false;
    isLoading.value = false;
  }, 1000);
};
</script>

<style scoped>
@import "../css/profile.css";
</style>
