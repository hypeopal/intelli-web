<template>
  <div class="slider-block">
    <span class="slider-label">{{label}}</span>
    <el-slider v-model="model" :min="min" :max="max" @change="$emit('event', {type: 'slider', value: model})"/>
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