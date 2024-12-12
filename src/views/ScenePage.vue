<template>
  <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;">
    <h1 style="user-select: none;">{{ t('automaticScene') }}</h1>
    <el-button type="primary" @click="showModal = true" style="font-size: 40px; width: 40px;margin-left: 45px;margin-top: 2px" :title="t('addScene')">+</el-button>
  </div>
  <div v-if="scenesList.length > 0">
    <div class="scene-container" >
      <div class="scene-card" v-for="scene in scenesList">
        <div class="scene-content">
          <div style="display: flex;flex-direction: row;align-items: center;">
            <h3 class="scene-title">{{ scene.scene.scene_name }}</h3>
            <el-popconfirm :title="t('confirmDelete')" @confirm="deleteScene(scene.scene.scene_id)">
              <template #reference>
                <el-button type="danger" plain style="width: 20px;"><i class="i-delete"></i></el-button>
              </template>
              <template #actions="{ confirm, cancel}">
                <el-button size="small" @click="cancel">{{ t('cancel') }}</el-button>
                <el-button type="danger" size="small" @click="confirm">{{ t('confirm') }}</el-button>
              </template>
            </el-popconfirm>
          </div>
          <p class="scene-description">{{t('house')}}:{{ scene.house_name }}</p>
          <div>
            <div>{{t('trigger')}}</div>
            <el-table :data="scene.scene.triggers" style="width: 100%">
              <el-table-column prop="data.freq" :label="t('frequency')" width="120">
                <template #default="scope">
                  {{ t(`${scope.row.data.freq}`) }}
                </template>
              </el-table-column>
              <el-table-column prop="data.time" :label="t('triggerTime')" width="100">
                <template #default="scope">
                  {{ scope.row.data.time }}
                </template>
              </el-table-column>
              <el-table-column prop="type" :label="t('triggerType')" width="100">
                <template #default="scope">
                  {{ t(`${scope.row.type}`) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <div>{{t('action')}}</div>
            <el-table :data="scene.scene.actions" style="width: 100%">
              <el-table-column prop="service_name" :label="t('action')" width="150">
                <template #default="scope">
                  {{ t(`${scope.row.service_name}`) }}
                </template>
              </el-table-column>
              <el-table-column prop="body" :label="t('Body')" width="120">
                <template #default="scope">
                  {{ scope.row.body }}
                </template>
              </el-table-column>
              <el-table-column prop="device_id" :label="t('deviceId')" width="120">
                <template #default="scope">
                  {{ scope.row.device_id }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
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
              <el-dropdown-item @click="addNewTrigger('Timer')">{{ t('timeTrigger') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <template v-for="(trigger, index) in newScene.triggers" v-if="newScene.triggers.length > 0">
        <div>
          <component :is="triggerCompo[trigger.type]"
                     :data="trigger.data"
                     :trigger_id="index"
                     @trigger-event="handleTriggerUpdate"
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
                     :action_id="index"
                     :devices="selectedArea.devices"
                     @action-event="handleActionUpdate"
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
import {ElMessage} from "element-plus";

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
  'Timer': TimeTrigger
}
const actionCompo = {
  'device': DeviceAction
}
const triggerType = {
  'Timer': {
    type: 'Timer',
    data: {
      time: '',
      freq: 'daily',
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
  selectedAreaId.value = null;
  selectedHouseId.value = null;
}
const changeNewHouse = () => {
  clearNewScene();
  selectedAreaId.value = null;
}
const deleteScene = async (id) => {
  try {
    await api.del(`/api/my/scene/${id}`);
    await getScene();
    ElMessage({
      message: t('deleteSuccess'),
      type: "success",
    })
  } catch (e) {
    ElMessage({
      message: t('deleteFail'),
      type: "error",
    })
  }
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
const handleTriggerUpdate = (event) => {
  if (event.type === 'time') {
    newScene.value.triggers[event.trigger_id].data = event.data;
  }
}
const handleActionUpdate = (event) => {
  if (event.type === 'device') {
    newScene.value.actions[event.action_id].device_id = event.device_id;
    newScene.value.actions[event.action_id].data = event.data;
  }
}
const submitScene = async () => {
  console.log(newScene.value);
  console.log(selectedHouseId.value);
  let actions = [];
  newScene.value.actions.forEach(action => {
    actions.push({
      device_id: action.device_id,
      service_name: action.data.action
    });
  });
  try {
    await api.post('/api/my/scene', {
      house_id: selectedHouseId.value,
      scene_name: newScene.value.scene_name,
      triggers: newScene.value.triggers,
      actions: actions
    });
    await getScene();
    ElMessage({
      message: t('addSuccess'),
      type: "success"
    });
  } catch (e) {
    ElMessage({
      message: t('addFail'),
      type: "success"
    });
  }
  showModal.value = false;
}
const getScene = async () => {
  try {
    const response = await api.get("/api/my/scene");
    scenesList.value.splice(0, scenesList.value.length);
    response.data.forEach(house => {
      house.scenes.forEach(scene => {
        scenesList.value.push({
          scene: scene,
          house_name: house.house_info.house_name
        });
      });
    });
    if (scenesList.value.length === 0) {
      message.value = t('noScene');
    } else {
      message.value = '';
    }
  } catch (e) {
    message.value = t('noScene');
  }
}
const getDevice = async () => {
  try {
    const response = await api.get("/api/my/device");
    devices.value = response.data.houses_devices;
    selectedHouseId.value = devices.value[0].house_info.house_id;
  } catch (e) {

  }
}
onMounted(async () => {
  await getScene();
  await getDevice();
  console.log('123');
})
</script>

<style scoped>
@import "../css/scene.css";
</style>
