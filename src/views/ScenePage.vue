<template>
  <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;">
    <h1 style="user-select: none;">{{ t('automaticScene') }}</h1>
    <el-button type="primary" @click="showModal = true" style="font-size: 40px; width: 40px;margin-left: 45px;margin-top: 2px" :title="t('addScene')">+</el-button>
  </div>
  <div v-if="scenesList.length > 0">
    <div v-for="scene in scenesList"></div>
  </div>

  <el-dialog v-model="showModal" align-center width="500">
    <template #header>
      {{ t('addScene') }}
    </template>
    <div style="margin-bottom: 10px;">
      <el-input v-model="newScene.scene_name" :placeholder="t('inputSceneName')" style="width: 180px;"/>
      <el-select v-model="selectedHouseId" :placeholder="t('chooseHome')" style="width: 120px;margin-left: 10px;" @change="changeNewHouse">
        <el-option v-for="house in devices" :label="house.house_info.house_name" :value="house.house_info.house_id"/>
      </el-select>
      <el-select v-if="selectedHouse.areas_devices.length > 0" v-model="selectedAreaId" :placeholder="t('chooseArea')" style="width: 120px;margin-left: 10px;" @change="clearNewScene">
        <el-option v-for="area in selectedHouse.areas_devices" :label="area.area_info.area_name" :value="area.area_info.area_id"/>
      </el-select>
    </div>
    <div class="trigger-new">
      <div style="display: flex;flex-direction: row;align-items: center;">
        {{ t('trigger') }}
        <el-dropdown placement="bottom" trigger="click">
          <el-button type="primary" style="margin-left: 25px;margin-top: 2px" size="small">{{ t('addTrigger') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="addNewTrigger('time')">{{ t('timeTrigger') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <template v-for="(trigger, index) in newScene.triggers" v-if="newScene.triggers.length > 0">
        <div>
          <component :is="triggerCompo[trigger.type]"
                     :data="trigger.data"
          />
          <el-button type="danger" plain style="width: 20px;margin-left: 5px;" @click="newScene.triggers.splice(index, 1)"><i class="i-delete"></i></el-button>
        </div>
      </template>
      <el-divider style="margin: 5px auto;"/>
    </div>
    <div class="action-new">
      <div style="display: flex;flex-direction: row;align-items: center;margin-bottom: 5px;">
        {{ t('action') }}
        <el-dropdown placement="bottom" trigger="click">
          <el-button type="primary" style="margin-left: 25px;margin-top: 2px" size="small">{{ t('addAction') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="addNewAction('device')">{{ t('deviceAction') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <template v-for="(action, index) in newScene.actions" v-if="newScene.actions.length > 0">
        <div>
          <component :is="actionCompo[action.type]"
                     :action="action"
                     :devices="selectedArea.devices"
          />
          <el-button type="danger" plain style="width: 20px;margin-left: 5px;" @click="newScene.actions.splice(index, 1)"><i class="i-delete"></i></el-button>
        </div>
      </template>
      <el-divider style="margin: 5px auto;"/>
    </div>
    <template #footer>
      <el-button @click="closeModal">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitScene">{{ t('confirm') }}</el-button>
    </template>
  </el-dialog>

  <div class="message" v-if="message">
    <el-empty :description="message" :image-size="300"/>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import {useI18n} from "vue-i18n";
import api from "../js/request.js";
import TimeTrigger from "./trigger/TimeTrigger.vue";
import DeviceAction from "./action/DeviceAction.vue";

const {t} = useI18n();
const message = ref('');
const scenesList = ref([]);
const devices = ref([]);
const selectedHouseId = ref(null);
const selectedAreaId = ref(null);
const showModal = ref(false);
const newScene = ref({
  scene_name: '',
  house_id: Number,
  triggers: [],
  actions: [],
});

const triggerCompo = {
  'time': TimeTrigger
}
const actionCompo = {
  'device': DeviceAction
}
const triggerType = {
  'time': {
    type: 'time',
    data: {
      value: '',
      frequency: 'daily',
    }
  },
}
const actionType = {
  'device': {
    type: 'device',
    device_id: null,
    data: {
      action: ''
    }
  }
}
const selectedHouse = computed(() => {
  return devices.value.find(house => house.house_info.house_id === selectedHouseId.value);
});
const selectedArea = computed(() => {
  return selectedHouse.value.areas_devices.find(area => area.area_info.area_id === selectedAreaId.value);
});
const closeModal = () => {
  showModal.value = false;
  clearNewScene();
  newScene.value.house_id = null;
  newScene.value.scene_name = '';
}
const changeNewHouse = () => {
  clearNewScene();
  selectedAreaId.value = null;
}
const clearNewScene = () => {
  newScene.value.triggers.splice(0, newScene.value.triggers.length);
  newScene.value.actions.splice(0, newScene.value.actions.length);
}
const addNewTrigger = (type) => {
  newScene.value.triggers.push(triggerType[type]);
}
const addNewAction = (type) => {
  newScene.value.actions.push(actionType[type]);
}
const submitScene = () => {

}
const getScene = async () => {
  message.value = t('noScene');
}
const getDevice = async () => {
  await api.get('/api/my/device').then((response) => {
    devices.value = response.data.houses_devices;
    selectedHouseId.value = devices.value[0].house_info.house_id;
  })
}
onMounted(() => {
  getScene();
  getDevice();
})
</script>

<style scoped>
@import "../css/form.css";
</style>
