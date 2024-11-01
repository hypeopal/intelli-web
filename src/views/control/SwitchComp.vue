<template>
  {{label}}
  <el-switch v-model="model"
             @change="model? $emit('event', 'close'): $emit('event', 'open')"/>
</template>

<script setup>
const model = defineModel("model");
const props = defineProps({
  label: String
});
</script>

<style scoped>

</style>