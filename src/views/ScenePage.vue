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
    <div>
      <el-input v-model="newScene.scene_name" :placeholder="t('inputSceneName')" style="width: 200px;"/>
      <el-select v-model="selectedHouseId" :placeholder="t('chooseHome')" style="width: 150px;margin-left: 10px;">
        <el-option v-for="house in devices" :label="house.house_info.house_name" :value="house.house_info.house_id"/>
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
      <template v-for="(trigger, index) in newScene.triggers">
        <span>{{ t('chooseTime') }}</span>
        <component :is="triggerCompo[trigger.type]"
                   :data="trigger.data"
        />
        <el-button type="danger" plain style="width: 20px;margin-left: 5px;" @click="newScene.triggers.splice(index, 1)"><i class="i-delete"></i></el-button>
        <el-divider style="margin: 5px auto;"/>
      </template>
    </div>
    <div class="action-new">
      <div style="display: flex;flex-direction: row;align-items: center;">
        {{ t('action') }}
        <el-dropdown placement="bottom" trigger="click">
          <el-button type="primary" style="margin-left: 25px;margin-top: 2px" size="small">{{ t('addAction') }}</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="addNewAction('time')">{{ t('deviceAction') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

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

const {t} = useI18n();
const message = ref('');
const scenesList = ref([]);
const devices = ref([]);
const selectedHouseId = ref(null);
const showModal = ref(false);
const newScene = ref({
  scene_name: '',
  house_id: Number,
  triggers: [],
  actions: []
});

const triggerCompo = {
  'time': TimeTrigger
}
const triggerType = {
  'time': {
    type: 'time',
    data: {
      value: '',
      frequency: 'everyday',
    }
  },
}
const selectedHouse = computed(() => {
  return devices.value.find(house => house.house_info.house_id === selectedHouseId.value);
})
const closeModal = () => {
  showModal.value = false;
  newScene.value.triggers = [];
}
const addNewTrigger = (type) => {
  newScene.value.triggers.push(triggerType[type]);
}
const addNewAction = (type) => {

}
const submitScene = () => {

}
const getScene = async () => {
  message.value = t('noScene');
}
const getDevice = async () => {
  await api.get('/api/my/device').then((response) => {
    devices.value = response.data.houses_devices;
    selectedHouse.value = devices.value[0];
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
