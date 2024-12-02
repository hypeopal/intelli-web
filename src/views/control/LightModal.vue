<template>
  test
  <label class="switch">
    <input type="checkbox" class="checkbox" v-model="lightSwitch" @click="console.log(lightSwitch)">
    <div class="slider"></div>
  </label>
  <el-slider style="margin-left: 5px;"/>
</template>

<script setup>
import {ref} from "vue";

const lightSwitch = ref(false);
</script>

<style scoped>
@import "../../css/control.css";
</style>