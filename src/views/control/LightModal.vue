<template>
  <label class="switch">
    <input type="checkbox" class="checkbox" v-model="lightSwitch"
           @click="lightSwitch?lightEvent({
              serviceName: 'close',
              method: 'get',
              contentType: 'text/plain',
              body: ''
           }):lightEvent({
              serviceName: 'open',
              method: 'get',
              contentType: 'text/plain',
              body: ''
           })" @change="lightBrightness = (lightSwitch ? 100 : 0)">
    <div class="slider"></div>
  </label>
  <el-slider style="margin-left: 5px;width: 80%;" v-model.lazy="lightBrightness"
             @change="lightSwitch = (lightBrightness!==0); lightEvent({
              serviceName: 'light',
              method: 'post',
              contentType: 'text/plain',
              body: lightBrightness
             });"/>
</template>

<script setup>
import {ref,onMounted} from "vue";
import api from "../../js/request.js";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const lightSwitch = ref(false);
const lightBrightness = ref(0);
const deviceData = ref({});
const props = defineProps({
  deviceId: Number,
});

const getDeviceState = async () => {
  await api.get(`/api/my/device/${props.deviceId}`).then((response) => {
    deviceData.value = response.data;
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
  console.log(deviceData.value);
});
</script>

<style scoped>
@import "../../css/control.css";
</style>