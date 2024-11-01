<template>
<!--  <p> {{ model }} </p>-->
<!--  <input type="button" @click="model++" value="+">-->
  <el-slider v-model="model" :min="min" :max="max"/>
</template>

<script setup>
const model = defineModel("model")
const props= defineProps({
  min: Number,
  max: Number
})
</script>

<style scoped>

</style>