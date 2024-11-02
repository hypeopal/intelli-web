<template>
  {{label}}
  <el-switch v-model="model"
             @change="model? $emit('event', {type: 'switch', value: 'close'}): $emit('event', {type: 'switch', value: 'open'})"
             @click=""
  />
</template>

<script setup>
const model = defineModel("model");
const props = defineProps({
  label: String
});
</script>

<style scoped>

</style>