<template>
  <span style="margin-left: 15px;margin-right: 5px;">{{ t('chooseDevice') }}</span>
  <el-select v-model="actionData.device_id" style="width: 180px;margin-left: 10px;" @change="selectDevice">
    <el-option v-for="device in props.devices" :label="device.device_name" :value="device.device_id"/>
  </el-select>
  <el-select v-if="deviceType === 'light'" v-model="actionData.data.action" @change="selectAction" style="width: 120px;">
    <el-option :label="t('lightOn')" value="open"/>
    <el-option :label="t('lightOff')" value="close"/>
  </el-select>
  <el-select v-if="deviceType === 'air-condition'" v-model="actionData.data.action" style="width: 120px;">
  </el-select>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const emit = defineEmits(['action-event']);
const props = defineProps({
  action: Object,
  action_id: Number,
  devices: Array,
});
const selectedDevice = computed(() => {
  return props.devices.find((device) => device.device_id === actionData.value.device_id);
});
const actionData = ref({
  device_id: props.action.device_id,
  data: {
    action: props.action.data.action,
  },
});
const deviceType = ref('');
const submitData = () => {
  emit('action-event', {
    type: 'device',
    device_id: actionData.value.device_id,
    action_id: props.action_id,
    data: actionData.value.data
  });
}
const selectDevice = () => {
  deviceType.value = selectedDevice.value.device_type.type_name;
  submitData();
}
const selectAction = () => {
  submitData();
}
onMounted(() => {
  actionData.value.device_id = props.devices[0].device_id;
  deviceType.value = props.devices[0].device_type.type_name;
  submitData();
})
</script>

<style scoped>

</style>