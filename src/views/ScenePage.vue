<template>
  <div>
    <!-- 触发按钮 -->
    <button class="open-modal-btn" @click="showModal = true">打开表单</button>

    <!-- 模态框 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2 style="user-select: none">填写信息</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">姓名:</label>
            <input type="text" v-model="formData.name" id="name" required/>
          </div>
          <div class="form-group">
            <label for="email">邮箱:</label>
            <input type="email" v-model="formData.email" id="email" required/>
          </div>
          <div class="form-group">
            <label for="age">年龄:</label>
            <input type="number" v-model="formData.age" id="age" required/>
          </div>
          <div class="button-group">
            <button type="submit" class="submit-btn">提交</button>
            <button type="button" class="close-btn" @click="closeModal">关闭</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

const showModal = ref(false);
const formData = ref({
  name: '',
  email: '',
  age: '',
});

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = () => {
  console.log('提交的数据:', formData.value);
  closeModal(); // 关闭表单
};
</script>

<style scoped>
@import "../css/form.css";
</style>
