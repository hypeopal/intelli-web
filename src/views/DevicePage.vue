<template>
  <div class="app-container">
    <h1 class="title">智能家居设备</h1>

    <div class="selectors">
      <div class="select-container" v-if="houses.length > 0">
        <label for="house-select">当前家庭:</label>
        <select id="house-select" v-model="selectedHouseId" @change="onHouseChange">
          <option v-for="house in houses" :key="house.house_id" :value="house.house_id">
            {{ house.house_name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 设备列表展示 -->
    <div v-if="selectedHouse && selectedHouse.areas_devices.length > 0" class="devices-section">
      <div v-for="area in selectedHouse.areas_devices" :key="area.area_id" class="area-section">
        <h2>{{ area.area_name }}的设备:</h2>
        <el-scrollbar class="scroll">
          <div class="devices-container">
            <div class="device-item" v-for="device in area.devices" :key="device.device_id" @click="openDeviceControl(device)">
              <h3>{{ device.device_name }}</h3>
              <p><strong>MAC:</strong> {{ device.efuse_mac }}</p>
              <p><strong>Model:</strong> {{ device.chip_model }}</p>
              <p><strong>Type:</strong> {{ device.device_type.type_name }}</p>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <div v-if="showControlModal" class="modal-overlay" @click="closeControlModal">
      <div v-if="showControlModal" class="device-control-modal" @click.stop>
          <h2>Control {{ currentDevice.device_name }}</h2>

          <!-- 根据设备类型展示不同的控制选项 -->
          <div v-if="currentDevice.device_type.type_name === 'light'">
            <p>Control Light:</p>
            <button @click="toggleLight">Toggle Light</button>
          </div>

          <div v-if="currentDevice.device_type.type_name === 'air condition'">
            <p>Control Air Condition:</p>
            <label>Temperature:</label>
            <input type="number" v-model="airConditionTemp" />
            <button @click="setAirConditionTemp">Set Temperature</button>
          </div>

          <!-- 关闭弹窗 -->
          <button class="close-button" @click="closeControlModal">Close</button>
      </div>
    </div>


    <div class="message" v-if="message">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { serverAddress } from '../../global';

const houses = ref([]);
const selectedHouseId = ref(null);
const showControlModal = ref(false);
const currentDevice = ref(null);
const airConditionTemp = ref(0);
const message = ref('正在加载...');

const selectedHouse = computed(() => {
  return houses.value.find(house => house.house_id === selectedHouseId.value);
});

const selectedArea = computed(() => {
  return selectedHouse.value
      ? selectedHouse.value.areas_devices.find(area => area.area_id === selectedAreaId.value)
      : null;
});

const fetchDevices = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("无法获取token");
      message.value = '浏览器异常，请退出后重新登录';
      return;
    }
    const headers = {
      'Authorization': 'Bearer ' + token,
    };
    const response = await axios.get(serverAddress + '/api/my/device', { headers });
    message.value = '';
    houses.value = response.data.data.houses_devices;

    if (houses.value.length > 0) {
      selectedHouseId.value = houses.value[0].house_id;
      if (selectedHouse.value.areas_devices.length === 0) {
        message.value = '您还未添加区域';
      }
    } else {
      message.value = '您还未添加家庭';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    message.value = '暂时无法获取设备，请稍后再试';
  }
};
const onHouseChange = () => {};
const onAreaChange = () => {};
const openDeviceControl = (device) => {
  currentDevice.value = device;
  showControlModal.value = true;
};
const closeControlModal = () => {
  showControlModal.value = false;
  currentDevice.value = null;
};
const toggleLight = async () => {
  try {
    const response = await axios.post('https://your-api-endpoint.com/control-light', {
      device_id: currentDevice.value.device_id,
      action: 'toggle'
    });
    console.log('Light toggled:', response.data);
    closeControlModal();
  } catch (error) {
    console.error('Error toggling light:', error);
  }
};
const setAirConditionTemp = async () => {
  try {
    const response = await axios.post('https://your-api-endpoint.com/control-air-condition', {
      device_id: currentDevice.value.device_id,
      temperature: airConditionTemp.value
    });
    console.log('Temperature set:', response.data);
    closeControlModal();
  } catch (error) {
    console.error('Error setting temperature:', error);
  }
};
onMounted(fetchDevices);
</script>

<style scoped>
@import "../css/list.css";
</style>
