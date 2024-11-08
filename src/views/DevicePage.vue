<template>
  <div class="app-container">
    <h1 class="title">
      {{ t('deviceTitle') }}
      <el-dropdown placement="bottom" trigger="click">
        <el-button type="primary" style="font-size: 40px; width: 40px;margin-left: 45px;margin-top: 2px"> +</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showAdd('home')">{{ t('addHome') }}</el-dropdown-item>
            <el-dropdown-item @click="showAdd('area')">{{ t('addArea') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </h1>

    <el-dialog v-model="showAddModal" width="500" align-center>
      <template #header>
        <div v-if="addType === 'home'">{{ t('addHome') }}</div>
        <div v-if="addType === 'area'">{{ t('addArea') }}</div>
      </template>
      <div v-if="addType === 'home'">
        <el-input v-model="newHouseName" :placeholder="t('inputHomeName')"/>
      </div>
      <div v-if="addType === 'area'">
        <el-select v-model="selectedAddHouse">
          <el-option v-for="house in housesList" :label="house.house_name" :value="house.house_id"></el-option>
        </el-select>
        <el-input v-model="newAreaName" :placeholder="t('inputAreaName')" style="margin-top: 10px;"/>
      </div>
      <template #footer>
        <el-button @click="closeAdd">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="addFunc">{{ t('confirm') }}</el-button>
      </template>
    </el-dialog>

    <div class="selectors">
      <div class="select-container" v-if="!loading && houses.length > 0">
        <label for="house-select">{{ t('home') }}:</label>
        <el-select id="house-select" v-model="selectedHouseId" @change="onHouseChange" style="width: 110px;">
          <el-option v-for="house in houses" :key="house.house_info.house_id" :value="house.house_info.house_id"
                     :label="house.house_info.house_name">
          </el-option>
        </el-select>
      </div>
    </div>

    <el-skeleton v-if="loading" animated :rows="0" :throttle="300">
      <el-skeleton-item variant="text" style="width: 200px; height: 20px;"/>
    </el-skeleton>
    <el-skeleton :loading="loading"
                 style="display: flex; gap: 8px;margin-top: 40px"
                 :count="3"
                 :throttle="300"
                 animated
    >
      <template #template>
        <div style="flex: 1;">
          <el-skeleton-item style="width: 100px; height: 100px;" variant="circle"/>
          <div style="padding: 14px">
            <el-skeleton-item variant="h3" style="width: 50%"/>
            <div
                style="
                display: flex;
                align-items: center;
                margin-top: 10px;
                margin-bottom: 5px;
                height: 16px;
              "
            >
              <el-skeleton-item variant="text" style="margin-right: 16px"/>
              <el-skeleton-item variant="text" style="width: 30%"/>
            </div>
            <div>
              <el-skeleton-item variant="text" style="width: 70%"/>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>

    <!-- 设备列表展示 -->
    <div v-if="!loading && selectedHouse && selectedHouse.areas_devices.length > 0" class="devices-section">
      <div v-for="area in selectedHouse.areas_devices" :key="area.area_info.area_id" class="area-section">
        <h2>{{ area.area_info.area_name }}{{ t('deviceOf') }}:</h2>
        <el-scrollbar class="scroll">
          <div class="devices-container">
            <div v-if="area.devices.length === 0" style="text-align: center;margin-top: 10px;font-size: 20px;">
              {{ t('noDevice') }}
            </div>
            <div class="device-item" v-for="device in area.devices" :key="device.device_id"
                 @click="openDeviceControl(device)">
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
        <div style="display: flex;flex-direction: row;align-items: center;">
          <h2>{{ currentDevice.device_name }}</h2>
          <el-button @click="toggleFavorite" text :title="t('favoriteDevice')" style="margin-top: 5px;">
            <i :class="`star`" :style="{ filter: true ? 'none' : 'grayscale(100%)' }"></i>
          </el-button>
        </div>
      </template>

      <div>
        {{ deviceState }}
      </div>
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
        <el-button @click="closeControlModal">{{ t('cancel') }}</el-button>
      </template>
    </el-dialog>


    <div class="message" v-if="message">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import axios from 'axios';
import {serverAddress} from '../../global';
import SwitchComp from "./control/SwitchComp.vue";
import SliderComp from "./control/SliderComp.vue";
import RadioComp from "./control/RadioComp.vue";
import "../assets/icon/icon.css";
import {useI18n} from "vue-i18n";
import {ElMessage} from "element-plus";

const {t} = useI18n();

const loading = ref(true);
const houses = ref([]);
const housesList = ref([]);
const devicesMap = ref({});
const selectedHouseId = ref(null);
const selectedAddHouse = ref(null);
const showControlModal = ref(false);
const showAddModal = ref(false);
const addType = ref('');
const currentDevice = ref(null);
const message = ref('');
const deviceState = ref('');
const newHouseName = ref('');
const newAreaName = ref('');

const controlComponents = {
  'boolean': SwitchComp,
  'range': SliderComp,
  'radio': RadioComp
}

const selectedHouse = computed(() => {
  return houses.value.find(house => house.house_info.house_id === selectedHouseId.value);
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
    const response = await axios.get(serverAddress + '/api/my/device', {headers});
    houses.value = response.data.data.houses_devices;
    loading.value = false;
    houses.value.forEach(house => {
      house.areas_devices.forEach(area => {
        area.devices.forEach(device => {
          devicesMap.value[device.device_id] = device;
        });
      });
    });
    houses.value.forEach(house => {
      housesList.value.push(house.house_info);
    });
    console.info(devicesMap);

    if (houses.value.length > 0) {
      selectedHouseId.value = houses.value[0].house_info.house_id;
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
const onHouseChange = () => {
  message.value = '';
  if (selectedHouse.value.areas_devices.length === 0) {
    message.value = t('noArea');
  }
};
const openDeviceControl = async (device) => {
  try {
    const response = await axios.get(serverAddress + '/api/my/device/' + device.device_id, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    deviceState.value = response.data;
  } catch (error) {
    console.error(error);
  }
  currentDevice.value = device;
  showControlModal.value = true;
};
const closeControlModal = () => {
  showControlModal.value = false;
};
const getEventHandlers = async (event) => {
  await axios.request({
    method: event.method,
    url: `${serverAddress}/api/my/device/${currentDevice.value.device_id}/service/${event.serviceName}`,
    headers: {
      "Content-Type": event.contentType,
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    },
    data: event.body,
  })
}
const showAdd = (type) => {
  addType.value = type;
  showAddModal.value = true;
};
const closeAdd = () => {
  showAddModal.value = false;
};
const addFunc = () => {

}
const toggleFavorite = () => {
  if (currentDevice) {
    ElMessage({
      message: t('favoriteSuccess'),
      type: "success",
    });
  }
}
onMounted(fetchDevices);
</script>

<style scoped>
@import "../css/list.css";
</style>
