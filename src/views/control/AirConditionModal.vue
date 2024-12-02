<template>
  <label class="switch">
    <input type="checkbox" class="checkbox" v-model="airSwitch" @click="console.log(airSwitch)">
    <div class="slider"></div>
  </label>
</template>

<script setup>
import {ref} from "vue";

const airSwitch = ref(false);
</script>

<style scoped>
@import "../../css/control.css";
</style>