<template>
  <div class="control-block">
    <div style="margin-right: 10px;">{{ t('lightSwitch') }}</div>
    <label class="switch">
      <input type="checkbox" class="checkbox" v-model="deviceData.switch"
             @click="deviceData.switch?lightEvent({
              serviceName: 'close',
              method: 'get',
              contentType: 'text/plain',
              body: ''
           }):lightEvent({
              serviceName: 'open',
              method: 'get',
              contentType: 'text/plain',
              body: ''
           })" @change="deviceData.brightness = (deviceData.switch ? 100 : 0)">
      <div class="slider"></div>
    </label>
  </div>
  <div class="control-block">
    <div style="margin-right: 10px;">{{ t('lightBrightness') }}</div>
    <el-slider style="margin-left: 5px;width: 80%;" v-model.lazy="deviceData.brightness"
               @change="deviceData.switch = (deviceData.brightness!==0); lightEvent({
              serviceName: 'light',
              method: 'post',
              contentType: 'text/plain',
              body: deviceData.brightness
             });"/>
  </div>
</template>

<script setup>
import {ref,onMounted} from "vue";
import api from "../../js/request.js";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const deviceData = ref({
  switch: Boolean,
  brightness: Number
});
const props = defineProps({
  deviceId: Number,
});

const getDeviceState = async () => {
  await api.get(`/api/my/device/${props.deviceId}/status`).then((response) => {
    deviceData.switch = deviceData.value["灯开关"];
    deviceData.brightness = deviceData.value["灯亮度"];
  });
}
const lightEvent = async (event) => {
  await api.request(`/api/my/device/${props.deviceId}/service/${event.serviceName}`, event.body,
      {contentType: event.contentType, method: event.method})
      .then((response) => {
        ElMessage({
          message: t('operateSuccess'),
          type: "success"
        });
      })
      .catch(_ => {
        ElMessage({
          message: t('operateFail'),
          type: "error"
        });
      });
}

onMounted(async () => {
  await getDeviceState();
});
</script>

<style scoped>
@import "../../css/control.css";
</style>