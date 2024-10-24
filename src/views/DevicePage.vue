<template>
  <div class="app-container">
    <h1 class="title">智能家居设备</h1>

    <!-- 横向排列的菜单选择 -->
    <div class="selectors">
      <!-- 菜单选择 House -->
      <div class="select-container" v-if="houses.length > 0">
        <label for="house-select">当前家庭:</label>
        <select id="house-select" v-model="selectedHouseId" @change="onHouseChange">
          <option v-for="house in houses" :key="house.house_id" :value="house.house_id">
            {{ house.house_name }}
          </option>
        </select>
      </div>

      <!-- 菜单选择 Area -->
      <div class="select-container" v-if="selectedHouse && selectedHouse.areas_devices.length > 0">
        <label for="area-select">当前区域:</label>
        <select id="area-select" v-model="selectedAreaId" @change="onAreaChange">
          <option v-for="area in selectedHouse.areas_devices" :key="area.area_id" :value="area.area_id">
            {{ area.area_name }}
          </option>
        </select>
      </div>
    </div>

    <!-- 设备列表展示 -->
    <div class="devices-section" v-if="selectedArea && selectedArea.devices.length > 0">
      <h2>{{ selectedArea.area_name }}的设备:</h2>
      <div class="devices-container">
        <div class="device-item" v-for="device in selectedArea.devices" :key="device.device_id" @click="openDeviceControl(device)">
          <h3>{{ device.device_name }}</h3>
          <p><strong>MAC:</strong> {{ device.efuse_mac }}</p>
          <p><strong>Model:</strong> {{ device.chip_model }}</p>
          <p><strong>Type:</strong> {{ device.device_type.type_name }}</p>
        </div>
      </div>
    </div>

    <div v-if="showControlModal" class="modal-overlay" @click="closeControlModal"></div>
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


    <div class="message" v-if="message">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {serverAddress} from "../../global";

export default {
  data() {
    return {
      message: '正在加载...',
      houses: [],  // 保存从后端获取的houses数据
      selectedHouseId: null,  // 选中的house_id
      selectedAreaId: null,  // 选中的area_id
      showControlModal: false,  // 控制弹窗是否显示
      currentDevice: null,  // 当前控制的设备
      airConditionTemp: 0,  // 空调温度
    };
  },
  computed: {
    selectedHouse() {
      return this.houses.find(house => house.house_id === this.selectedHouseId);
    },
    selectedArea() {
      return this.selectedHouse
          ? this.selectedHouse.areas_devices.find(area => area.area_id === this.selectedAreaId)
          : null;
    }
  },
  created() {
    this.fetchDevices();
  },
  methods: {
    async fetchDevices() {
      try {
        const token = localStorage.getItem('token');
        if(!token) {
          console.log("无法获取token");
          this.message = '浏览器异常，请退出后重新登录';
          return;
        }
        const headers ={
          'Authorization': 'Bearer ' + token,
        };
        const response = await axios.get(serverAddress + '/api/my/device', {headers: headers});
        this.message = '';
        this.houses = response.data.data.houses_devices;
        if (this.houses.length > 0) {
          this.selectedHouseId = this.houses[0].house_id;
          if (this.selectedHouse.areas_devices.length > 0) {
            this.selectedAreaId = this.selectedHouse.areas_devices[0].area_id;
          } else {
            this.selectedAreaId = null;
            this.message = '您还未添加区域';
          }
        } else {
          this.message = '您还未添加家庭';
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        this.message = '暂时无法获取设备，请稍后再试';
      }
    },
    onHouseChange() {
      if (this.selectedHouse.areas_devices.length > 0) {
        this.selectedAreaId = this.selectedHouse.areas_devices[0].area_id;
      } else {
        this.selectedAreaId = null;
      }
    },
    onAreaChange() {

    },
    // 打开设备控制弹窗
    openDeviceControl(device) {
      this.currentDevice = device;
      this.showControlModal = true;
    },
    // 关闭控制弹窗
    closeControlModal() {
      this.showControlModal = false;
      this.currentDevice = null;
    },
    // 控制灯的开关
    async toggleLight() {
      try {
        const response = await axios.post('https://your-api-endpoint.com/control-light', {
          device_id: this.currentDevice.device_id,
          action: 'toggle'
        });
        console.log('Light toggled:', response.data);
        this.closeControlModal();
      } catch (error) {
        console.error('Error toggling light:', error);
      }
    },
    // 设置空调温度
    async setAirConditionTemp() {
      try {
        const response = await axios.post('https://your-api-endpoint.com/control-air-condition', {
          device_id: this.currentDevice.device_id,
          temperature: this.airConditionTemp
        });
        console.log('Temperature set:', response.data);
        this.closeControlModal();
      } catch (error) {
        console.error('Error setting temperature:', error);
      }
    }
  }
};
</script>

<style scoped>
@import "../css/list.css";
</style>
