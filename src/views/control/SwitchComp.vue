<template>
  {{ label }}
  <el-switch v-model="model.灯开关" @change="model['灯亮度']=model['灯开关']?100:0;switchChange()"
  />
</template>

<script setup>
import {ElMessage} from "element-plus";

const emit = defineEmits(['event']);
const model = defineModel("model");
const props = defineProps({
  label: String,
  callback: Object,
});
const switchChange = () => {
  console.log(model.value);
  service(!model.value['灯开关'] ? 'onClose' : 'onOpen', undefined);
  ElMessage({
    message: '操作成功',
    type: 'success',
  })
}

const service = (even, contentBody) => {
  let service = props.callback[even];
  let path = service["service_name"];
  let method = service["method"];
  let contentType = service["content_type"];

  emit('event', {
    serviceName: path,
    method: method,
    contentType: contentType,
    body: contentBody,
  })
}

</script>

<style scoped>

</style>