<template>
  <div class="profile-container">
    <div class="user-section">
      <h2>{{userInfo.username}}</h2>
      <div style="margin-bottom: 20px">欢迎回来！</div>
      <el-button type="danger" plain @click="openModifyModal('password')">修改密码</el-button>
    </div>
    <div class="info-section">
      <el-button type="warning" plain class="modify-button" v-if="modified" @click="handleSubmit">确认修改</el-button>
      <h2 class="profile-title">用户信息</h2>
      <div style="margin: 5px 0 20px;">此处设置基本账户信息</div>
      <div>
        真实姓名：
        <input v-model="userInfo.name" class="profile-input" type="text" placeholder="输入真实姓名" @change="handleChange"/>
      </div>
      <div>
        年龄：
        <el-input-number v-model="userInfo.age" :min="0" :max="100" @change="handleChange" size="small" />
      </div>
      <div>
        性别：
        <el-radio-group v-model="userInfo.gender" @change="handleChange">
          <el-radio value="male">男</el-radio>
          <el-radio value="female">女</el-radio>
          <el-radio value="secret">武装直升机</el-radio>
        </el-radio-group>
      </div>
      <div>城市：{{ userInfo.city }}
        <el-button plain @click="openModifyModal('city')">修改</el-button>
      </div>
      <div style="display: flex;flex-direction: column;">
        <div>邮箱：</div>
        <el-input type="email" v-model="userInfo.email" @change="handleChange" />
      </div>
      <el-dialog
        v-model="showModifyModal"
        width="500"
        align-center
        destroy-on-close
      >
        <template #header>
          <h2>修改{{ modifyType }}</h2>
        </template>

        <div v-if="modifyType === 'city'">
          <el-cascader
              v-model.lazy="modifiedCity"
              :options="data"
              :props="props"
              @change="handleChange"
              placeholder="选择城市"
              class="city-selector"
              filterable />
        </div>

        <div v-if="modifyType === 'password'">
          <el-input v-model="newPassword" placeholder="请输入新密码" type="password" show-password />
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showModifyModal = false">取消</el-button>
            <el-button type="primary" :loading="isLoading" @click="handleSubmit">确认</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import data from "../assets/City.json";
import axios from "axios";
import {serverAddress} from "../../global.js";
import {ElMessage} from "element-plus";

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
const newPassword = ref('');

const props = {
  expandTrigger: 'hover'
};
const handleChange = (value) => {
  modified.value = true;
  console.log(value);
};
const getUserData = async () => {
  //get user data
  userInfo.value.gender = 'secret';
  userInfo.value.city = '成都';
  userInfo.value.username = localStorage.getItem("username");
}
const handleSubmit = async () => {
  isLoading.value = true;
  if (modifyType.value === 'password') {
    try {
      // const response = await axios.post(serverAddress + '/api/user', userInfo.value);
      alert(newPassword.value);
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
      //     message: '修改成功',
      //     type: 'success'
      //   });
      //   modified.value = false;
      //   showModifyModal.value = false;
      //   await getUserData();
      // }
      alert(userInfo.value);
    } catch (error) {
      ElMessage({
        message: '修改失败',
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
