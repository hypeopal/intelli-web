<template>
  <span style="margin-left: 15px;margin-right: 5px;">{{ t('chooseTime') }}</span>
  <el-time-picker v-model="time"
                  :placeholder="t('chooseTime')"
                  @change="timeChange"
                  value-format="HH:mm"
                  format="HH:mm"
                  style="width: 150px; margin: 5px 0;"
  />
  <el-select v-model="frequency" @change="timeChange" style="width: 100px;">
    <el-option :label="t('everyday')" value="daily"/>
    <el-option :label="t('once')" value="once"/>
  </el-select>
</template>

<script setup>
import {ref} from "vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n();

const emit = defineEmits(['trigger-event']);
const props = defineProps({
  data: Object,
  trigger_id: Number,
});
const time = ref(props.data.time);
const frequency = ref(props.data.freq);
const timeChange = () => {
  emit('trigger-event', {
    type: 'time',
    trigger_id: props.trigger_id,
    data: {
      time: time.value,
      freq: frequency.value
    }
  });
}
</script>

<style scoped>

</style>