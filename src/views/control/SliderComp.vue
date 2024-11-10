<template>
  <div class="slider-block">
    <span class="slider-label">{{ label }}</span>
    <el-slider v-model="model.灯亮度" :min="min" :max="max" @change="console.log(model);model['灯开关']=!model['灯亮度']==0;$emit('event', {
      serviceName: 'light',
      method: 'post',
      contentType: 'text/plain',
      body: model === undefined ? '0' : model['灯亮度'].toString()
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