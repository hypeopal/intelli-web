<template>
  <div class="control-block">
    <div style="margin-right: 15px;">{{ t('airSwitch') }}</div>
    <input type="checkbox" id="checkbox" v-model="airData.switch" @change="openAir"/>
    <label for="checkbox" class="switch">
      Start
      <svg
          class="slider"
          viewBox="0 0 512 512"
          height="1em"
          xmlns="http://www.w3.org/2000/svg"
      >
        <path
            d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V32zM143.5 120.6c13.6-11.3 15.4-31.5 4.1-45.1s-31.5-15.4-45.1-4.1C49.7 115.4 16 181.8 16 256c0 132.5 107.5 240 240 240s240-107.5 240-240c0-74.2-33.8-140.6-86.6-184.6c-13.6-11.3-33.8-9.4-45.1 4.1s-9.4 33.8 4.1 45.1c38.9 32.3 63.5 81 63.5 135.4c0 97.2-78.8 176-176 176s-176-78.8-176-176c0-54.4 24.7-103.1 63.5-135.4z"
        ></path>
      </svg>
    </label>
  </div>
  <div class="control-block">
    <div style="margin-right: 10px;">{{ t('airModel') }}</div>
    <el-radio-group v-model="airData.model" :disabled="!airData.switch" @change="">
      <el-radio-button :label="t('auto')" value="auto"/>
      <el-radio-button :label="t('cool')" value="cool"/>
      <el-radio-button :label="t('warm')" value="warm"/>
    </el-radio-group>
  </div>
  <div class="control-block">
    <div style="margin-right: 10px;">{{ t('airTemp') }}</div>
    <el-input-number v-model.lazy="airData.temp" :step="0.5" :min="16" :max="30" :disabled="!airData.switch" @change="changeTemp"/>
  </div>
  <div class="control-block">
    <div style="margin-right: 10px;">{{ t('airWind') }}</div>
    <el-radio-group v-model="airData.wind" :disabled="!airData.switch">
      <el-radio-button :label="t('auto')" value="auto"/>
      <el-radio-button :label="t('low')" value="low"/>
      <el-radio-button :label="t('medium')" value="medium"/>
      <el-radio-button :label="t('high')" value="high"/>
    </el-radio-group>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import api from "../../js/request.js";
import {useI18n} from "vue-i18n";

const {t} =useI18n();
const airData = ref({
  switch: false,
  temp: 26,
  model: '',
  wind: '',
});
const deviceData = ref({});
const props = defineProps({
  deviceId: Number,
});

const openAir = async () => {
  if (airData.value.switch) {
    await api.get(`/api/my/device/${props.deviceId}/power-on`);
  } else {
    await api.get(`/api/my/device/${props.deviceId}/power-off`);
  }
}
const changeTemp = async () => {
  await api.get(`/api/my/device/${props.deviceId}/temperature`, airData.value.temp);
}
const getDeviceState = async () => {
  try {
    const response = await api.get(`/api/my/device/${props.deviceId}/status`);
    airData.value.switch = response.data["电源"];
    airData.value.temp = response.data["温度"];
    airData.value.model = response.data["模式"];
    airData.value.wind = response.data["风速"];
  } catch (e) {

  }
}
onMounted(async () => {
  await getDeviceState();
})
</script>

<style scoped>
.control-block {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
}
#checkbox {
  display: none;
}

.switch {
  position: relative;
  width: fit-content;
  padding: 10px 20px;
  background-color: rgb(46, 46, 46);
  border-radius: 50px;
  z-index: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.3s;
}
.switch svg path {
  fill: white;
}
#checkbox:checked + .switch {
  background-color: rgb(39, 217, 88);
  box-shadow: 0 0 20px rgb(33, 179, 70);
}
</style>