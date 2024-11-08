<template>
  <div class="slider-block">
    <span class="slider-label">{{ label }}</span>
    <el-slider v-model="model" :min="min" :max="max" @change="$emit('event', {
      serviceName: 'light',
      method: 'post',
      contentType: 'text/plain',
      body: model === undefined ? '0' : model.toString()
    })"/>
  </div>
</template>

<script setup>
const model = defineModel("model");
const props = defineProps({
  min: Number,
  max: Number,
  label: String
});
</script>

<style scoped>
@import "../../css/control.css";
</style>