<template>
  <div class="profile-container">
    <div class="user-section">
      <h2>{{ userInfo.username }}</h2>
      <div style="margin-bottom: 20px">{{ t('welcome') }}！</div>
      <el-button type="danger" plain @click="openModifyModal('password')">{{ t('modifyPassword') }}</el-button>
    </div>
    <div class="info-section">
      <el-button type="warning" plain class="modify-button" v-if="modified" @click="handleSubmit" :loading="isLoading">
        {{ t('confirmChange') }}
      </el-button>
      <h2 class="profile-title">{{ t('userInfo') }}</h2>
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
      <div>{{ info }}</div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import data from "../assets/City.json";
import axios from "axios";
import {serverAddress} from "../../global.js";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const modifiedCity = ref([]);
const modified = ref(false);
const isLoading = ref(false);
const showModifyModal = ref(false);
const modifyType = ref('');

//用户数据
const userInfo = ref({
  city: '',
  username: '',
  gender: '',
  email: '',
  name: '',
  age: 18,
});
const info = ref('');
const newPassword = ref('');

const props = {
  expandTrigger: 'hover'
};
const handleChange = (value) => {
  modified.value = true;
  console.log(value);
};
const getUserData = async () => {
  try {
    const response = await axios.get(serverAddress + '/api/userinfo', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    info.value = response.data;
  } catch (error) {
    console.log(error);
  }
}
const handleSubmit = async () => {
  isLoading.value = true;
  if (modifyType.value === 'password') {
    try {
      // const response = await axios.post(serverAddress + '/api/user', userInfo.value);
      newPassword.value = '';
    } catch (error) {
      console.error(error);
    }
    modifyType.value = '';
  } else {
    try {
      // const response = await axios.post(serverAddress + '/api/user', userInfo.value);
      // if (response.status === 200) {
      //   console.log('更新成功:', response.data);
      //   ElMessage({
      //     message: t('modifySuccess'),
      //     type: 'success'
      //   });
      //   modified.value = false;
      //   showModifyModal.value = false;
      //   await getUserData();
      // }
    } catch (error) {
      ElMessage({
        message: t('modifyFail'),
        type: 'error'
      });
      console.error('更新失败:', error);
    }
  }
  await getUserData();
  modified.value = false;
  isLoading.value = false; // 恢复加载状态
  showModifyModal.value = false;
};
const openModifyModal = (type) => {
  modifyType.value = type;
  showModifyModal.value = true;
}
onMounted(() => {
  getUserData();
})
</script>

<style scoped>
@import "../css/profile.css";
</style>
