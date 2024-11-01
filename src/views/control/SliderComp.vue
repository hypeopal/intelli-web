<template>
<!--  <p> {{ model }} </p>-->
<!--  <input type="button" @click="model++" value="+">-->
  <div class="slider-block">
    <span class="slider-label">{{label}}</span>
    <el-slider v-model="model" :min="min" :max="max"/>
  </div>
</template>

<script setup>
const model = defineModel("model");
const props= defineProps({
  min: Number,
  max: Number,
  label: String
});
</script>

<style scoped>
@import "../../css/control.css";
</style>