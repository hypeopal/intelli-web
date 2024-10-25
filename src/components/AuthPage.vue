<template>
  <div class="login-page">
    <div class="login-logo">Intelli Home</div>
    <router-view/>
  </div>
<!--  <canvas class="background"></canvas>-->
</template>

<script>
// import Particles from '../../node_modules/particlesjs/dist/particles.min.js';

// export default {
  // methods: {
  //   initParticles() {
  //     Particles.init({
  //       selector: '.background',
  //       color: '#6db8de',
  //       maxParticles: 200,
  //       sizeVariations: 3,
  //       connectParticles: true,
  //       minDistance: 60,
  //       speed: 0.2,
  //     });
  //   }
  // },
  // mounted() {
  //   this.initParticles();
  // },
  // activated() {
  //   this.initParticles();
  // },
  // unmounted() {
  //   Particles.destroy();
  // }
// };
</script>

<style scoped>
@import "../css/login.css";
</style>
