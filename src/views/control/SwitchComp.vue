<template>
  <el-switch v-model="model"/>
<!--  <p> {{ model }} </p>-->
<!--  <input type="button" @click="model = !model" value="toggle">-->
</template>

<script setup>
const model = defineModel("model")
const props = defineProps()
</script>

<style scoped>

</style>