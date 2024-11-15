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
      <!--      <div>-->
      <!--        {{ t('trueName') }}：-->
      <!--        <input v-model.lazy="userInfo.name" class="profile-input" type="text" v-bind:placeholder="t('inputTrue')"-->
      <!--               @change="handleChange"/>-->
      <!--      </div>-->
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
          <h2>{{ t('modify') }} {{ modifyType }}</h2>
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
          <el-input v-model.lazy="newPassword" v-bind:placeholder="t('inputNewPass')" type="password" show-password/>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showModifyModal = false">{{ t('cancel') }}</el-button>
            <el-button type="primary" :loading="isLoading" @click="handleSubmit">{{ t('confirm') }}</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <div class="section" style="height: auto">
      <h2 class="profile-title">{{ t('security') }}</h2>
      <el-popconfirm :title="t('confirmCancel')" @confirm="cancelAccount">
        <template #reference>
          <el-button type="danger" plain @click="">{{ t('cancelAccount')}}</el-button>
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
import axios from "axios";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";

const {t} = useI18n();
const router = useRouter();

const modifiedCity = ref([]);
const modified = ref(false);
const isLoading = ref(false);
const showModifyModal = ref(false);
const modifyType = ref('');

const username = ref('');
//用户数据
const userInfo = ref({
  city: '',
  gender: '',
  email: '',
  name: '',
  age: 18,
});
const newPassword = ref('');

const props = {
  expandTrigger: 'hover'
};
const handleLogout = inject('handleLogout');
const handleChange = (value) => {
  modified.value = true;
  console.log(value);
};
const getUserData = async () => {
  try {
    username.value = localStorage.getItem("username");
    const response = await axios.get('/api/userinfo', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    userInfo.value.age = response.data.data.age;
    userInfo.value.city = response.data.data.city;
    userInfo.value.email = response.data.data.email;
    userInfo.value.gender = response.data.data.gender === 'male' ? 'male' : 'female';
  } catch (error) {
    console.log(error);
  }
}
const handleSubmit = async () => {
  console.log("submit");
  isLoading.value = true;
  if (modifyType.value === 'password') {
    try {
      // const response = await axios.post(serverAddress + '/api/user', userInfo.value);
    } catch (error) {
      console.error(error);
    }
    newPassword.value = '';
    modifyType.value = '';
  } else if(modifyType.value === 'city') {
    userInfo.value.city = modifiedCity.value[1] || userInfo.value.city;
    modifiedCity.value = [];
    modifyType.value = '';
    isLoading.value = false; // 恢复加载状态
    showModifyModal.value = false;
    return;
  } else {
    await submitInfo();
  }
  await getUserData();
  modified.value = false;
  isLoading.value = false; // 恢复加载状态
  showModifyModal.value = false;
};
const submitInfo = async () => {
  try {
    const response = await axios.request( {
      url: '/api/userinfo',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      data: userInfo.value,
    });
    if (response.status === 200) {
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
const cancelAccount = () => {
  alert("delete");
  // post to server
  handleLogout();
}
onMounted(() => {
  getUserData();
});
</script>

<style scoped>
@import "../css/profile.css";
</style>
