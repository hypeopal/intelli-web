<template>
  <router-view />
</template>

<script setup>
import {useTheme} from "./js/UseTheme.js";
const {theme} = useTheme();
</script>
