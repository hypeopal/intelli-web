<template>
  <el-time-picker v-model.lazy="time"
                  :placeholder="t('chooseTime')"
                  @change="timeChange"
                  value-format="HH:mm"
                  format="HH:mm"
                  style="width: 150px;"
  />
  <el-select v-model.lazy="frequency" @change="frequencyChange" style="width: 100px;">
    <el-option :label="t('everyday')" value="everyday"/>
    <el-option :label="t('once')" value="once"/>
  </el-select>
</template>

<script setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const emit = defineEmits(['update:data.value', 'update:data.frequency']);
const props = defineProps({
  data: Object
});
const time = ref(props.data.value);
const frequency = ref(props.data.frequency);
const timeChange = () => {
  emit('update:data.value', time.value);
}
const frequencyChange = () => {
  emit('update:data.frequency', frequency.value);
}
</script>

<style scoped>

</style>