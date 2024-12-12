<template>
  <div class="profile-container">
    <div class="section">
      <h2>{{ username }}</h2>
      <div style="margin-bottom: 20px">{{ t('welcome') }}！</div>
      <el-button type="danger" plain @click="openModifyModal('password')">{{ t('modifyPassword') }}</el-button>
    </div>

    <div class="section info">
      <h2 class="profile-title">
        {{ t('userInfo') }}
        <el-button type="warning" plain class="modify-button" v-if="modified" @click="handleSubmit" :loading="isLoading">
          {{ t('confirmChange') }}
        </el-button>
      </h2>
      <div style="margin: 5px 0 20px;">{{ t('setInfo') }}</div>
      <div style="margin-top: 10px">
        {{ t('age') }}：
        <el-input-number v-model.lazy="userInfo.age" :min="0" :max="100" @change="handleChange" size="small"/>
      </div>
      <div style="margin-top: 10px">
        {{ t('gender') }}：
        <el-radio-group v-model.lazy="userInfo.gender" @change="handleChange">
          <el-radio value="male">{{ t('male') }}</el-radio>
          <el-radio value="female">{{ t('female') }}</el-radio>
          <el-radio value="secret">{{ t('secret') }}</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 10px">
        {{ t('city') }}：{{ userInfo.city }}
        <el-button plain @click="openModifyModal('city')">{{ t('modify') }}</el-button>
      </div>
      <div style="display: flex;flex-direction: row;margin-top: 10px">
        <div>{{ t('mail') }}：</div>
        <el-input type="email" v-model.lazy="userInfo.email" @change="handleChange" style="width: 80%"/>
      </div>
      <el-dialog
          v-model="showModifyModal"
          width="500"
          align-center
          destroy-on-close
      >
        <template #header>
          <h2>{{ t('modify') }}{{ t(`${modifyType}`) }}</h2>
        </template>

        <div v-if="modifyType === 'city'">
          <el-cascader
              v-model.lazy="modifiedCity"
              :options="data"
              :props="props"
              @change="handleChange"
              v-bind:placeholder="t('chooseCity')"
              class="city-selector"
              filterable/>
        </div>

        <div v-if="modifyType === 'password'">
          <el-input v-model.lazy="oldPassword" :placeholder="t('inputOldPass')" type="password" show-password/>
          <el-input v-model.lazy="newPassword" :placeholder="t('inputNewPass')" type="password" show-password/>
          <el-input v-model.lazy="confirmPassword" :placeholder="t('confirmNewPass')" type="password" show-password/>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showModifyModal = false">{{ t('cancel') }}</el-button>
            <el-button type="primary" :loading="isLoading" @click="handleSubmit">{{ t('confirm') }}</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <div class="section" v-if="houseMember.length > 0">
      <h2 class="profile-title">{{ t('homeManage') }}</h2>

      <div >
        <el-scrollbar style="width: 100%">
          <div style="display: flex;flex-direction: row;">
            <div class="bg-shadow" v-if="expand"></div>
            <div class="house-card" v-for="house in houseMember" :key="house.house_info.house_id"
                 :class="{'collapsed': collapsedCards[house.house_info.house_id], 'expanded': expandedCards[house.house_info.house_id]}"
            >
              <div class="tools">
                <div class="circle">
                  <el-popconfirm :title="t('confirmDelete')" @confirm="deleteHouse(house)" width="200">
                    <template #reference>
                      <span class="box" style="background-color: #ff605c;cursor: pointer;" :title="t('deleteHouse')"></span>
                    </template>
                    <template #actions="{ confirm, cancel}">
                      <el-button size="small" @click="cancel">{{ t('cancel') }}</el-button>
                      <el-button type="danger" size="small" @click="confirm">{{ t('confirm') }}</el-button>
                    </template>
                  </el-popconfirm>
                </div>
                <div class="circle">
                  <span class="box" style="background-color: #ffbd44;cursor: pointer" @click="toggleCard(house.house_info.house_id)" :title="collapsedCards[house.house_info.house_id]?t('expand'):t('collapse')"></span>
                </div>
                <div class="circle">
                  <span class="box" style="background-color: #00ca4e;cursor: pointer" @click="expandCard(house.house_info.house_id)" :title="expandedCards[house.house_info.house_id]?t('shrink'):t('enlarge')"></span>
                </div>
              </div>
              <div class="card-content">
                <div style="text-align: center">{{house.house_info.house_name}}</div>
                <div v-if="!collapsedCards[house.house_info.house_id]" style="margin-bottom: 10px;">
                  <el-descriptions :title="t('houseInfo')" border direction="vertical">
                    <el-descriptions-item :label="t('houseId')">{{house.house_info.house_id}}</el-descriptions-item>
                    <el-descriptions-item :label="t('memberNum')">{{house.account.length}}</el-descriptions-item>
                  </el-descriptions>
                </div>
                <div v-if="expandedCards[house.house_info.house_id]">
                  <div style="margin-bottom: 10px">{{ t('memberList') }}</div>
                  <el-table :data="house.account" border style="width: 100%">
                    <el-table-column prop="account_id" :label="t('accountId')" width="120"/>
                    <el-table-column prop="username" :label="t('username')" width="150"/>
                    <el-table-column :label="t('operation')" width="100">
                      <template #default="scope">
                        <el-popconfirm :title="t('confirmDelete')" @confirm="deleteMember(scope.row.account_id)">
                          <template #reference>
                            <el-button type="danger" plain size="small">{{ t('deleteMember')}}</el-button>
                          </template>
                          <template #actions="{ confirm, cancel}">
                            <el-button size="small" @click="cancel">{{ t('cancel') }}</el-button>
                            <el-button type="danger" size="small" @click="confirm">{{ t('confirm') }}</el-button>
                          </template>
                        </el-popconfirm>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="section">
      <h2 class="profile-title">{{ t('security') }}</h2>
      <el-popconfirm :title="t('confirmCancel')" @confirm="cancelAccount" width="200">
        <template #reference>
          <el-button type="danger" plain>{{ t('cancelAccount')}}</el-button>
        </template>
        <template #actions="{ confirm, cancel}">
          <el-button size="small" @click="cancel">{{ t('cancel') }}</el-button>
          <el-button type="danger" size="small" @click="confirm">{{ t('confirm') }}</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, inject} from "vue";
import data from "../assets/City.json";
import api from "../js/request.js";
import {ElMessage, ElNotification} from "element-plus";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";

const {t} = useI18n();
const router = useRouter();

const modifiedCity = ref([]);
const modified = ref(false);
const isLoading = ref(false);
const showModifyModal = ref(false);
const modifyType = ref('');
const houseMember = ref([]);
const collapsedCards = ref([]);
const expandedCards = ref([]);
const expand = ref(false);
const selectedHouseId = ref(null);

const username = ref('');
//用户数据
const userInfo = ref({
  city: '',
  gender: '',
  email: '',
  age: Number,
});
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const props = {
  expandTrigger: 'hover'
};
const handleLogout = inject('handleLogout');
const handleChange = (value) => {
  modified.value = true;
  console.log(value);
};
const getUserData = async () => {
  username.value = localStorage.getItem("username");
  await api.get('/api/userinfo').then((response) => {
    userInfo.value.age = response.data.age;
    userInfo.value.city = response.data.city;
    userInfo.value.email = response.data.email;
    userInfo.value.gender = response.data.gender === 'male' ? 'male' : 'female';
  });
}
const getHouseData = async () => {
  await api.get('/api/my/member')
      .then((response) => {
        if (response.code === 200) {
          houseMember.value = response.data.houses_member;
        }
      });
}
const handleSubmit = async () => {
  isLoading.value = true;
  if (modifyType.value === 'password') {
    if (newPassword.value !== confirmPassword.value) {
      ElMessage({
        message: t('passwordNotSame'),
        type: "error"
      });
      return;
    }
    try {
      await api.get('/api/login', {
        username: username.value,
        password: oldPassword.value
      }, {noAuth: true});
      try {
        // const response = await api.post('/api/user', userInfo.value);
      } catch (e) {

      }
    } catch (error) {
      ElMessage({
        message: t('passwordError'),
        type: "error"
      })
    }
    newPassword.value = '';
    confirmPassword.value = '';
    oldPassword.value = '';
    modifyType.value = '';
  } else if(modifyType.value === 'city') {
    userInfo.value.city = modifiedCity.value[1] || userInfo.value.city;
    modifiedCity.value = [];
    modifyType.value = '';
    isLoading.value = false; // 恢复加载状态
    showModifyModal.value = false;
    localStorage.removeItem("cityId");
    return;
  } else {
    await submitInfo();
  }
  modified.value = false;
  isLoading.value = false; // 恢复加载状态
  showModifyModal.value = false;
};
const submitInfo = async () => {
  try {
    const response = await api.post('/api/userinfo', userInfo.value, {'Content-Type': 'application/json'});
    if (response.status === 200) {
      await getUserData();
      localStorage.removeItem("lastUpdate");
      console.log('更新成功:', response.data);
      ElMessage({
        message: t('modifySuccess'),
        type: 'success'
      });
    }
  } catch (error) {
    ElMessage({
      message: t('modifyFail'),
      type: 'error'
    });
    console.error('更新失败:', error);
  }
}
const openModifyModal = (type) => {
  modifyType.value = type;
  showModifyModal.value = true;
}
const cancelAccount = async () => {
  await api.del('/api/account').then((response) => {
    if (response.code === 200) {
      ElMessage({
        message: t('deleteSuccess'),
        type: "success"
      });
      handleLogout();
    }
  });
}
const deleteHouse = async (house) => {
  let devices = JSON.parse(localStorage.getItem('device'));
  let deletingHouse;
  devices.forEach(device => {
    if (device.house_info.house_id === house.house_info.house_id) {
      deletingHouse = device;
    }
  });
  if (deletingHouse.areas_devices.length > 0 || house.account.length > 1) {
    ElNotification({
      title: t('dangerOperation'),
      message: t('deleteHouseError'),
      type: 'error',
      duration: 5000,
    });
  } else {
    try {
      await api.del(`/api/my/house/${house.house_info.house_id}`);
      ElMessage({
        message: t('deleteSuccess'),
        type: "success",
      });
      await getHouseData();
    } catch (e) {
      ElMessage({
        message: t('deleteFail'),
        type: "error"
      });
    }
  }
}
const toggleCard = (houseId) => {
  collapsedCards.value[houseId] = !collapsedCards.value[houseId];
  if (collapsedCards.value[houseId]) {
    expandedCards.value[houseId] = false;
    expand.value = false;
  }
}
const expandCard = (houseId) => {
  selectedHouseId.value = houseId;
  expandedCards.value[houseId] = !expandedCards.value[houseId];
  if (!expand.value) {
    collapsedCards.value[houseId] = false;
    setTimeout(() => {
      expand.value = !expand.value;
    }, 200)
  } else {
    expand.value = !expand.value;
    collapsedCards.value[houseId] = true;
  }
}
const deleteMember = async (id) => {
  try {
    await api.del('/api/my/member', {
      account_id: parseInt(id),
      house_id: selectedHouseId.value
    });
    ElMessage({
      message: t('deleteSuccess'),
      type: "success"
    });
    await getHouseData();
  } catch (e) {
    ElMessage({
      message: t('deleteFail'),
      type: "error"
    })
  }
}
onMounted(async () => {
  await getUserData();
  await getHouseData();
  houseMember.value.forEach(house => {
    collapsedCards.value[house.house_info.house_id] = true;
  });
});
</script>

<style scoped>
@import "../css/profile.css";
</style>
