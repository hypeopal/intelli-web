<template>
  <el-radio-group v-model="model">
    <el-radio-button
        v-for="(option, index) in options"
        :value="index"
        :label="option"
    />
  </el-radio-group>
</template>

<script setup>
const model = defineModel("model");
const props = defineProps({
  options: Array,
});
</script>

<style scoped>

</style>
