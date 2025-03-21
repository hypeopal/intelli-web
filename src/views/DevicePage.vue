<template>
  <div class="app-container">
    <h1 class="title">
      {{ t('deviceTitle') }}
      <el-dropdown placement="bottom" trigger="click">
        <el-button type="primary" style="font-size: 40px; width: 40px;margin-left: 45px;margin-top: 2px">+</el-button>
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
        <div v-if="addType === 'house'">{{ t('addHome') }}</div>
        <div v-if="addType === 'area'">{{ t('addArea') }}</div>
        <div v-if="addType === 'member'">{{ t('addMember') }}</div>
      </template>
      <div v-if="addType === 'house'">
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
            <template v-if="isEditing">
              <el-input v-model="editString"/>
            </template>
            <template v-else>
              <h2>{{ currentDevice.device_name }}</h2>
            </template>
            <el-button @click="toggleFavorite(currentDevice.device_id)" text :title="t('favoriteDevice')" style="margin-top: 5px;">
              <i class="i-star" :style="{ filter: favorites[currentDevice.device_id] ? 'none' : 'grayscale(100%)' }"></i>
            </el-button>
          </div>
          <div>
            <template v-if="isEditing">
              <el-button @click="saveDeviceName">{{ t('save') }}</el-button>
            </template>
            <template v-else>
              <el-button @click="editDeviceName">{{ t('edit') }}</el-button>
            </template>
            <el-popconfirm :title="t('confirmDelete')" @confirm="deleteDevice">
              <template #reference>
                <el-button type="danger" plain style="width: 20px;"><i class="i-delete"></i></el-button>
              </template>
              <template #actions="{ confirm, cancel}">
                <el-button size="small" @click="cancel">{{ t('cancel') }}</el-button>
                <el-button type="danger" size="small" @click="confirm">{{ t('confirm') }}</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>

      <component
          :is="controlComponents[currentDevice.model_id]"
          :deviceId="currentDevice.device_id"
          v-if="showControlModal"
      />

      <template #footer>
        <el-button @click="closeControlModal">{{ t('cancel') }}</el-button>
      </template>
    </el-dialog>


    <div class="message" v-if="message">
      <el-empty :description="message" :image-size="300"/>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import { EventSourcePolyfill } from 'event-source-polyfill';
import api from '../js/request.js';
import "../assets/icon/icon.css";
import {useI18n} from "vue-i18n";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import LightModal from "./control/LightModal.vue";
import TempSensorModal from "./control/TempSensorModal.vue";
import AirConditionModal from "./control/AirConditionModal.vue";
import VideoPlayer from "./control/VideoPlayer.vue";
const es = new EventSourcePolyfill('/api/my/sse', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
  },
  heartbeatTimeout: 3 * 60 * 1000,
});

es.onopen = (event) => {
  console.log("connection open:", event);
}
es.onmessage = (event) => {
  console.log("connection message:", event);
}
es.onerror = (event) => {
  console.log("connection error:", event);
}

const {t} = useI18n();
const route = useRoute();

const loading = ref(true); // 加载状态
const metaData = ref([]); // 设备数据
const housesList = ref([]); // 家庭列表
const selectedHouseId = ref(null); // 选中的家庭ID
const selectedAddHouse = ref(null); // 选中添加区域的家庭ID
const showControlModal = ref(false); // 显示控制弹窗
const showAddModal = ref(false); // 显示添加弹窗
const addType = ref(''); // 添加类型
const currentDevice = ref(null); // 当前选中的设备
const message = ref(''); // 消息提示
const newHouseName = ref(''); // 新家庭名称
const newAreaName = ref(''); // 新区域名称
const newMember = ref();
const isEditing = ref(false);
const editString = ref('');
const favorites = ref({});

const controlComponents = {
  '2': LightModal,
  '8': TempSensorModal,
  '9': AirConditionModal,
  '10': VideoPlayer
}

const selectedHouse = computed(() => {
  return metaData.value.find(house => house.house_info.house_id === selectedHouseId.value);
});

const editDeviceName = () => {
  editString.value = currentDevice.value.device_name;
  isEditing.value = true;
}
const saveDeviceName = async () => {
  try {
    const response = await api.patch(`/api/my/device/${currentDevice.value.device_id}`, {
      device_name: editString.value,
    });
    if (response.code === 200) {
      currentDevice.value.device_name = editString.value;
      ElMessage({
        message: t('modifySuccess'),
        type: "success"
      });
      localStorage.removeItem("device");
      await fetchDevices(false);
    }
  } catch (e) {
    ElMessage({
      message: t('modifyFail'),
      type: "error"
    });
  }
  editString.value = '';
  isEditing.value = false;
}
const fetchDevices = async (isInit = true) => {
  try {
    await api.get('/api/my/device').then((response) => {
      metaData.value = response.data.houses_devices;
      localStorage.setItem("device", JSON.stringify(metaData.value));
    });
    loading.value = false;
    metaData.value.forEach(house => {
      housesList.value.push(house.house_info);
      house.areas_devices.forEach(area => {
        area.devices.forEach(device => {
          favorites.value[device.device_id] = false;
        })
      })
    });


    if (metaData.value.length > 0) {
      if (isInit){
        selectedHouseId.value = Number(route.query.houseId);
        if (!selectedHouseId.value)
          selectedHouseId.value = metaData.value[0].house_info.house_id;
      }
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
const openDeviceControl = (device) => {
  currentDevice.value = device;
  showControlModal.value = true;
};
const closeControlModal = () => {
  showControlModal.value = false;
};
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
  if (success) {
    await fetchDevices(false);
    ElMessage({
      message: t('addSuccess'),
      type: "success"
    });
  } else {
    ElMessage({
      message: t('addFail'),
      type: "error"
    });
  }
  closeAdd();
}
const addHome = async () => {
  try {
    const response = await api.post('/api/my/house', {house_name: newHouseName.value});
    return response.code === 200;
  } catch (e) {
    return false;
  }
}
const addArea = async () => {
  try {
    const response = await api.post('/api/my/area', {
      house_id: selectedAddHouse.value,
      area_name: newAreaName.value,
    });
    return response.code === 200;
  } catch (e) {
    return false;
  }
}
const addMember = async () => {
  try {
    const response = await api.post('/api/my/member', {
      house_id: selectedAddHouse.value,
      account_id: newMember.value - 0,
    });
    return true;
  } catch (e) {
    return false;
  }
}
const toggleFavorite = (id) => {
  if (favorites.value[id]) {
    try {
      const response = api.del(`/api/my/favorite/${id}`);
      favorites.value[id] = false;
      ElMessage({
        message: t('cancelFavoriteSuccess'),
        type: "success",
      });
    } catch (e) {
      ElMessage({
        message: t('cancelFavoriteFail'),
        type: "error",
      });
    }
  } else {
    try {
      const response = api.post('/api/my/favorite', {device_id: id});
      favorites.value[id] = true;
      ElMessage({
        message: t('favoriteSuccess'),
        type: "success",
      });
    } catch (e) {
      ElMessage({
        message: t('favoriteFail'),
        type: "error",
      });
    }
  }
}
const getFavorite = async () => {
  try {
    const response = await api.get('/api/my/favorite');
    response.data.forEach(device => {
      favorites.value[device.device_id] = true;
    })
  } catch (e) {
    console.log(e);
  }
}
const deleteDevice = async () => {
  api.del(`/api/my/device/${currentDevice.value.device_id}`).then().catch();
  closeControlModal();
}
const getDeviceById = (id) => {
  metaData.value.forEach(house => {
    house.areas_devices.forEach(area => {
      area.devices.forEach(device => {
        if (device.device_id === id) {
          currentDevice.value = device;
          selectedHouseId.value = house.house_info.house_id;
          showControlModal.value = true;
        }
      })
    })
  });
}
onMounted(async () => {
  await fetchDevices();
  await getFavorite();
  if (route.query.deviceId) {
    getDeviceById(Number(route.query.deviceId));
  }
});
</script>

<style scoped>
@import "../css/list.css";
</style>
