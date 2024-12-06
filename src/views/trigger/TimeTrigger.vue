<template>
  <el-time-picker v-model.lazy="time"
                  placeholder="Arbitrary time"
                  @change="handleChange"
                  value-format="HH:mm"
                  format="HH:mm"/>
</template>

<script setup>
import {ref} from "vue";

const emit = defineEmits(['update:data'])
const props = defineProps({
  data: String,
});
const time = ref(props.data);
const handleChange = () => {
  emit('update:data', time.value)
}
</script>

<style scoped>

</style>