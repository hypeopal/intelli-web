<template>
  <div class="app-container">
    <h1 class="title">
      {{ t('deviceTitle') }}
      <el-dropdown placement="bottom" trigger="click">
        <el-button type="primary" style="font-size: 40px; width: 40px;margin-left: 45px;margin-top: 2px"> +</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showAdd('house')">{{ t('addHome') }}</el-dropdown-item>
            <el-dropdown-item @click="showAdd('area')">{{ t('addArea') }}</el-dropdown-item>
            <el-dropdown-item @click="showAdd('member')">{{ t('addMember') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </h1>

    <el-dialog v-model="showAddModal" width="500" align-center>
      <template #header>
        <div v-if="addType === 'home'">{{ t('addHome') }}</div>
        <div v-if="addType === 'area'">{{ t('addArea') }}</div>
        <div v-if="addType === 'member'">{{ t('addMember') }}</div>
      </template>
      <div v-if="addType === 'home'">
        <el-input v-model="newHouseName" :placeholder="t('inputHomeName')"/>
      </div>
      <div v-if="addType === 'area'">
        <el-select v-model="selectedAddHouse" :placeholder="t('chooseHome')">
          <el-option v-for="house in housesList" :label="house.house_name" :value="house.house_id"></el-option>
        </el-select>
        <el-input v-model="newAreaName" :placeholder="t('inputAreaName')" style="margin-top: 10px;"/>
      </div>
      <div v-if="addType === 'member'">
        <el-select v-model="selectedAddHouse" :placeholder="t('chooseHome')">
          <el-option v-for="house in housesList" :label="house.house_name" :value="house.house_id"></el-option>
        </el-select>
        <el-input v-model="newMember" :placeholder="t('inputMember')" style="margin-top: 10px;"/>
      </div>
      <template #footer>
        <el-button @click="closeAdd">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="addFunc">{{ t('confirm') }}</el-button>
      </template>
    </el-dialog>

    <div class="selectors">
      <div class="select-container" v-if="!loading && metaData.length > 0">
        <label for="house-select">{{ t('home') }}:</label>
        <el-select id="house-select" v-model="selectedHouseId" @change="onHouseChange" style="width: 110px;">
          <el-option v-for="house in metaData" :key="house.house_info.house_id" :value="house.house_info.house_id"
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
              <i :class="`di-${device.device_type.type_name}-100`"></i>
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
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between">
          <div style="display: flex;flex-direction: row;align-items: center;">
            <h2>{{ currentDevice.device_name }}</h2>
            <el-button @click="toggleFavorite" text :title="t('favoriteDevice')" style="margin-top: 5px;">
              <i class="i-star" :style="{ filter: true ? 'none' : 'grayscale(100%)' }"></i>
            </el-button>
          </div>
          <div>
            <el-button>{{ t('edit') }}</el-button>
            <el-button type="danger" plain style="width: 20px;"><i class="i-delete" style="filter: "></i></el-button>
          </div>
        </div>
      </template>

      <div>
        {{ deviceState }}
      </div>
      <div v-for="(control, index) in currentDevice.service" :key="index">
        <component
            :is="controlComponents[control.type]"
            v-model:model="deviceService[currentDevice.device_id]"
            :label="control.label"
            v-bind="control.params"
            :callback="control.callback"
            v-on:event="getEventHandlers"
        />
      </div>
      <component :is="controlComponents[currentDevice.device_type.type_name]"/>

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
import api from '../js/request.js';
import axios from "axios";
import SwitchComp from "./control/SwitchComp.vue";
import SliderComp from "./control/SliderComp.vue";
import RadioComp from "./control/RadioComp.vue";
import "../assets/icon/icon.css";
import {useI18n} from "vue-i18n";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import LightModal from "./control/LightModal.vue";
import AirConditionModal from "./control/AirConditionModal.vue";

const {t} = useI18n();
const route = useRoute();


const loading = ref(true); // 加载状态
const metaData = ref([]); // 设备数据
const housesList = ref([]); // 家庭列表
const deviceService = ref({}); // 设备映射
const selectedHouseId = ref(null); // 选中的家庭ID
const selectedAddHouse = ref(null); // 选中添加区域的家庭ID
const showControlModal = ref(false); // 显示控制弹窗
const showAddModal = ref(false); // 显示添加弹窗
const addType = ref(''); // 添加类型
const currentDevice = ref(null); // 当前选中的设备
const message = ref(''); // 消息提示
const deviceState = ref(''); // 设备状态
const newHouseName = ref(''); // 新家庭名称
const newAreaName = ref(''); // 新区域名称
const newMember = ref('');
const deviceModal = ref({});
// const source = new EventSource('/api/my/sse', {
//   withCredentials: true,
//   headers: {
//     'Authorization': 'Bearer ' + localStorage.getItem('token'),
//   }
// });

// source.onmessage = (event) => {
//   console.log(event);
// };

const controlComponents = {
  'boolean': SwitchComp,
  'range': SliderComp,
  'radio': RadioComp,
  'light': LightModal,
  'air-condition': AirConditionModal
}

const selectedHouse = computed(() => {
  return metaData.value.find(house => house.house_info.house_id === selectedHouseId.value);
});

const fetchDevices = async () => {
  try {
    if (parseInt(localStorage.getItem("fetchTime")) === 5 || localStorage.getItem("fetchTime") === null || localStorage.getItem("device") === null) {
      await api.get('/api/my/device').then((response) => {
        console.log(response);
        metaData.value = response.data.houses_devices;
        localStorage.setItem("device", JSON.stringify(metaData.value));
        localStorage.setItem("fetchTime", "1");
      });
    } else {
      localStorage.setItem("fetchTime", (parseInt(localStorage.getItem("fetchTime")) + 1).toString());
      metaData.value = JSON.parse(localStorage.getItem("device"));
    }
    loading.value = false;
    metaData.value.forEach(house => {
      house.areas_devices.forEach(area => {
        area.devices.forEach(device => {
          device.service.forEach(service => {
            if (!deviceService.value[device.device_id]) {
              deviceService.value[device.device_id] = {};
            }
            deviceService.value[device.device_id][service.label] = service.value;
          })
        });
      });
    });
    deviceModal.value = deviceService.value;
    console.log(deviceModal.value);
    metaData.value.forEach(house => {
      housesList.value.push(house.house_info);
    });

    if (metaData.value.length > 0) {
      selectedHouseId.value = Number(route.query.id);
      if (!selectedHouseId.value)
        selectedHouseId.value = metaData.value[0].house_info.house_id;
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
  api.get(`/api/my/device/${device.device_id}/status`).then((response) => {
    deviceState.value = response.data;
  });
  currentDevice.value = device;
  showControlModal.value = true;
};
const closeControlModal = () => {
  showControlModal.value = false;
};
const getEventHandlers = async (event) => {
  await axios.request({
    method: event.method,
    url: `/api/my/device/${currentDevice.value.device_id}/service/${event.serviceName}`,
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
  newAreaName.value = '';
  newHouseName.value = '';
  newMember.value = '';
};
const addFunc = async () => {
  let success = false;
  switch (addType.value) {
    case 'house':
      success = await addHome();
      break;
    case 'area':
      success = await addArea();
      break;
    case 'member':
      success = await addMember();
      break;
  }
  if (success === true) {
    ElMessage({
      message: t('addSuccess'),
      type: "success"
    });
  } else {
    ElMessage({
      message: t('addFail'),
      type: "warning"
    });
  }
  closeAdd();
}
const addHome = async () => {
  api.post('/api/my/house', {house_name: newHouseName.value})
      .then((response) => {
        return response.status === 200;
      });
}
const addArea = async () => {
  api.post('/api/my/area', {
    house_id: selectedAddHouse.value,
    area_name: newAreaName.value,
  }).then((response) => {
    return response.status === 200;
  });
}
const addMember = async () => {
  api.post('/api/my/member', {
    house_id: selectedAddHouse.value,
    member_name: newMember.value,
  }).then((response) => {
    return response.status === 200;
  });
}
const toggleFavorite = () => {
  if (currentDevice) {
    ElMessage({
      message: t('favoriteSuccess'),
      type: "success",
    });
  }
}
const deleteDevice = async () => {
  api.del(`/api/my/device/${currentDevice.value.device_id}`).then().catch();
  closeControlModal();
}
onMounted(() => {
  fetchDevices();
});
</script>

<style scoped>
@import "../css/list.css";
</style>
