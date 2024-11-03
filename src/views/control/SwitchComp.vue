<template>
  {{label}}
  <el-switch v-model="model"
             @change="switchChange()"
  />
</template>

<script setup>
import {ElMessage} from "element-plus";

const emit = defineEmits(['event']);
const model = defineModel("model");
const props = defineProps({
  label: String
});
const switchChange = () => {
  model.value? emit('event', {type: 'switch', value: 'close'}): emit('event', {type: 'switch', value: 'open'});
  ElMessage({
    message: '操作成功',
    type: 'success',
  })
}
</script>

<style scoped>

</style>