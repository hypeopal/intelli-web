<template>
  <label class="switch">
    <input type="checkbox" class="checkbox" v-model="airSwitch" @click="console.log(airSwitch)">
    <div class="slider"></div>
  </label>
  <el-input-number step="0.5" min="16" max="30"/>
</template>

<script setup>
import {ref} from "vue";

const airSwitch = ref(false);
</script>

<style scoped>
@import "../../css/control.css";
</style>