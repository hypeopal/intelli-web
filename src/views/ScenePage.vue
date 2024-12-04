<template>
  <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;">
    <h1 style="user-select: none;">{{ t('automaticScene') }}</h1>
    <el-button type="primary" @click="showModal = true" style="font-size: 40px; width: 40px;margin-left: 45px;margin-top: 2px" :title="t('addScene')">+</el-button>
  </div>

  <el-dialog v-model="showModal" align-center width="500">
    <template #header>
      {{ t('addScene') }}
    </template>
    <div>
      123
    </div>
    <template #footer>
      <el-button @click="closeModal">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="">{{ t('confirm') }}</el-button>
    </template>
  </el-dialog>

  <div class="message" v-if="message">
    <el-empty :description="message" :image-size="300"/>
  </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();
const message = ref('');
const scenesList = ref([]);
const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;

}
const getScene = async () => {
  message.value = t('noScene');
}
onMounted(() => {
  getScene();
} )
</script>

<style scoped>
@import "../css/form.css";
</style>
