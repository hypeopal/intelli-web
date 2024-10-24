<template>
  <div>
    <h2>概览</h2>
  </div>
  <div>
    <weather-chart/>
  </div>
</template>

<script>
import WeatherChart from "../components/WeatherChart.vue";

export default {
  name: "ViewPage1",
  components: {WeatherChart},
};
</script>
