<template>
  <div class="profile-container">
    <div class="user-section">
      <h2>{{username}}</h2>
    </div>
    <div class="info-section">
      <h2 class="profile-title">账户信息</h2>
      <div style="margin: 5px 0 20px;">此处设置基本账户信息</div>
      <div>城市：{{ uCity }}
        <el-button plain @click="openModifyModal('城市')">修改</el-button>
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

        <div v-if="modifyType === '城市'">
          <el-cascader
              v-model.lazy="modifiedCity"
              :options="data"
              :props="props"
              @change="handleChange"
              placeholder="选择城市"
              class="city-selector"
              filterable />
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

const modifiedCity = ref([]);
const modified = ref(false);
const isLoading = ref(false);
const showModifyModal = ref(false);
const modifyType = ref('');

//用户数据
const uCity = ref('');
const username = ref('');

const props = {
  expandTrigger: 'hover',
};
const handleChange = (value) => {
  modified.value = true;
  console.log(value);
};
const getUserData = async () => {
  //get user data
  uCity.value = '成都';
  username.value = localStorage.getItem("username");
}
const handleSubmit = () => {
  isLoading.value = true;
  setTimeout(() => {
    console.log('提交的数据:', modifiedCity.value);
    uCity.value = modifiedCity.value[2];
    modified.value = false;
    isLoading.value = false;
    showModifyModal.value = false;
  }, 1000);
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
