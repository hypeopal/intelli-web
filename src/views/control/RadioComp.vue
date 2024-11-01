<template>
  <el-radio-group v-model="model">
    <el-radio-button
        v-for="(option, index) in options"
        :value="index"
        :label="option.label"
    />
  </el-radio-group>
</template>

<script setup>
import { ref } from 'vue';

const model = defineModel("model");
const props = defineProps({
  options: Array,
});
</script>

<style>

</style>
