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

    <el-dialog
        v-model="showControlModal"
        width="500"
        align-center
        :destroy-on-close
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

const houses = ref([]);
const selectedHouseId = ref(null);
const showControlModal = ref(false);
const currentDevice = ref(null);
const message = ref('正在加载...');

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
};
const getEventHandlers = async (event) => {
  await axios.get(`${serverAddress}/api/my/device/${currentDevice.value.device_id}/${event}`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  });
}
// const toggleLight = async () => {
//   try {
//     const response = await axios.post('https://your-api-endpoint.com/control-light', {
//       device_id: currentDevice.value.device_id,
//       action: 'toggle'
//     });
//     console.log('Light toggled:', response.data);
//     closeControlModal();
//   } catch (error) {
//     console.error('Error toggling light:', error);
//   }
// };
// const setAirConditionTemp = async () => {
//   try {
//     const response = await axios.post('https://your-api-endpoint.com/control-air-condition', {
//       device_id: currentDevice.value.device_id,
//       temperature: airConditionTemp.value
//     });
//     console.log('Temperature set:', response.data);
//     closeControlModal();
//   } catch (error) {
//     console.error('Error setting temperature:', error);
//   }
// };
onMounted(fetchDevices);
</script>

<style scoped>
@import "../css/list.css";
</style>
