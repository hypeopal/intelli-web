<template>
  <div class="app-container">
    <h1 class="title">{{t('deviceTitle')}}</h1>

    <div class="selectors">
      <div class="select-container" v-if="!loading && houses.length > 0">
        <label for="house-select">{{t('home')}}:</label>
        <el-select id="house-select" v-model="selectedHouseId" @change="onHouseChange" style="width: 110px;">
          <el-option v-for="house in houses" :key="house.house_id" :value="house.house_id" :label="house.house_name">
          </el-option>
        </el-select>
      </div>
    </div>

    <el-skeleton v-if="loading" animated :rows="0" :throttle="300">
      <el-skeleton-item variant="text" style="width: 200px; height: 20px;" />
    </el-skeleton>
    <el-skeleton :loading="loading"
                 style="display: flex; gap: 8px;margin-top: 40px"
                 :count="3"
                 :throttle="300"
                 animated
    >
      <template #template>
        <div style="flex: 1;">
          <el-skeleton-item style="width: 100px; height: 100px;" variant="circle" />
          <div style="padding: 14px">
            <el-skeleton-item variant="h3" style="width: 50%" />
            <div
                style="
                display: flex;
                align-items: center;
                margin-top: 10px;
                margin-bottom: 5px;
                height: 16px;
              "
            >
              <el-skeleton-item variant="text" style="margin-right: 16px" />
              <el-skeleton-item variant="text" style="width: 30%" />
            </div>
            <div>
              <el-skeleton-item variant="text" style="width: 70%" />
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>

    <!-- 设备列表展示 -->
    <div v-if="!loading && selectedHouse && selectedHouse.areas_devices.length > 0" class="devices-section">
      <div v-for="area in selectedHouse.areas_devices" :key="area.area_id" class="area-section">
        <h2>{{ area.area_name }}{{t('deviceOf')}}:</h2>
        <el-scrollbar class="scroll">
          <div class="devices-container">
            <div class="device-item" v-for="device in area.devices" :key="device.device_id" @click="openDeviceControl(device)">
              <i :class="`di-${device.device_type.type_name}`"></i>
              <h3>{{ device.device_name }}</h3>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <el-dialog
        v-model="showControlModal"
        width="500"
        align-center
    >
      <template #header>
        <h2>{{ currentDevice.device_name }}</h2>
      </template>

      <div v-for="(control, index) in currentDevice.service" :key="index">
        <component
            :is="controlComponents[control.type]"
            v-model:model="control.value"
            :label="control.label"
            v-bind="control.params"
            :callback="control.callback"
            v-on:event="getEventHandlers"
        />
      </div>

      <template #footer>
        <el-button @click="closeControlModal">Close</el-button>
      </template>
    </el-dialog>


    <div class="message" v-if="message">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { serverAddress } from '../../global';
import SwitchComp from "./control/SwitchComp.vue";
import SliderComp from "./control/SliderComp.vue";
import RadioComp from "./control/RadioComp.vue";
import "../assets/device_logo/icon.css";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const loading = ref(true);
const houses = ref([]);
const selectedHouseId = ref(null);
const showControlModal = ref(false);
const currentDevice = ref(null);
const message = ref('');

const controlComponents = {
  'boolean': SwitchComp,
  'range': SliderComp,
  'radio': RadioComp
}

const selectedHouse = computed(() => {
  return houses.value.find(house => house.house_id === selectedHouseId.value);
});

const fetchDevices = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("无法获取token");
      message.value = t('browserError');
      return;
    }
    const headers = {
      'Authorization': 'Bearer ' + token,
    };
    const response = await axios.get(serverAddress + '/api/my/device', { headers });
    houses.value = response.data.data.houses_devices;
    loading.value = false;

    if (houses.value.length > 0) {
      selectedHouseId.value = houses.value[0].house_id;
      if (selectedHouse.value.areas_devices.length === 0) {
        message.value = t('noArea');
      }
    } else {
      message.value = t('noHome');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    message.value = t('notGetDevice');
    loading.value = false;
  }
};
const onHouseChange = () => {};
const openDeviceControl = (device) => {
  currentDevice.value = device;
  showControlModal.value = true;
};
const closeControlModal = () => {
  showControlModal.value = false;
};
const getEventHandlers = async (event) => {
  if(currentDevice.value.device_type.type_name === 'light'){
    await axios.get(`${serverAddress}/api/my/device/${currentDevice.value.device_id}/${event.type === 'slider' ? "light=" : ""}${event.value}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
  }
}
onMounted(fetchDevices);
</script>

<style scoped>
@import "../css/list.css";
</style>
