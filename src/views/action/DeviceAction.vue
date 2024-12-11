<template>
  <span style="margin-left: 15px;margin-right: 5px;">{{ t('chooseDevice') }}</span>
  <el-select v-model="actionData.device_id" style="width: 200px;margin-left: 10px;" @change="selectDevice">
    <el-option v-for="device in props.devices" :label="device.device_name" :value="device.device_id"/>
  </el-select>
  <el-select v-if="selectedDevice.device_type.type_name === 'light'" v-model="actionData.data.action" @change="selectAction">
    <el-option :label="t('lightOn')" value="on"/>
    <el-option :label="t('lightOff')" value="off"/>
  </el-select>
  <el-select v-if="selectedDevice.device_type.type_name === 'air-condition'" v-model="actionData.data.action">
  </el-select>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const emit = defineEmits(['update:action.device_id', 'update:action.data.action']);
const props = defineProps({
  action: Object,
  devices: Array,
});
const selectedDevice = computed(() => {
  return props.devices.find((device) => device.device_id === actionData.value.device_id);
});
const actionData = ref({
  device_id: props.action.device_id,
  data: props.action.data,
});
const selectDevice = () => {
  emit('update:action.device_id', actionData.value.device_id);
}
const selectAction = () => {
  emit('update:action.data.action', actionData.value.data.action);
}
onMounted(() => {
  actionData.value.device_id = props.devices[0].device_id;
  emit('update:action.device_id', selectedDevice.value.device_id);
})
</script>

<style scoped>

</style>