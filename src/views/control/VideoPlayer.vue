<template>
  <div style="width: 100%; height: 100%;">
    <video
        ref="videoElement"
        controls
        muted
        style="width: 100%; height: 100%; object-fit: fill"
    />
  </div>
</template>

<script setup>
import hlsjs from "hls.js";
import {ElMessage} from "element-plus";
import {useI18n} from "vue-i18n";
import {ref, onMounted, onUnmounted} from "vue";
import api from "../../js/request.js";

const {t} = useI18n();
const props = defineProps({
  deviceId: Number,
});
const videoUrl = ref('');
const videoElement = ref(null);
let hls = null;

const playVideo = () => {
  if (videoUrl.value === '') return;
  if (hlsjs.isSupported()) {
    hls = new hlsjs();
    hls.loadSource(videoUrl.value);
    hls.attachMedia(videoElement.value);
    hls.on(hlsjs.Events.MANIFEST_PARSED, () => {
      videoElement.value.play();
    });
    hls.on(hlsjs.Events.ERROR, (event, data) => {
      console.log(event, data);
    });
  } else {
    ElMessage({
      message: t("playFail"),
      type: "error",
    });
    videoElement.value.src = videoUrl.value; // 回退播放
    videoElement.value.play();
  }
};
const closeVideo = () => {
  if (hls) {
    hls.detachMedia();
    hls.destroy();
    hls = null;
  }
};
onMounted(async () => {
  console.log("123");
  try {
    const response = await api.get('/api/my/device/' + props.deviceId + '/status');
    videoUrl.value = response.data.stream_url + "/index.m3u8";
  } catch (e) {
    console.error(e);
  }
  playVideo();
});
onUnmounted(() => {
  closeVideo();
});
</script>

<style scoped></style>
