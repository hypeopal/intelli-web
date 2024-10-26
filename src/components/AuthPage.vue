<template>
  <div class="login-page">
    <div class="login-logo">Intelli Home</div>
    <router-view/>
  </div>
  <vue-particles
      id="tsparticles"
      :particlesLoaded="particlesLoaded"
      :options="options"
  />
</template>

<script setup>
const particlesLoaded = async container => {
  console.log("Particles container loaded", container);
};
const options = {
  background: {
    color: {
      value: '#fff'
    }
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: false,
        mode: 'push'
      },
      onHover: {
        enable: true,
        mode: 'grab',
        parallax: {
          enable: true,
          force: 60,
          smooth: 10
        }
      },
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40
      },
      push: {
        quantity: 4
      },
      repulse: {
        distance: 200,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: '#16a8f0'
    },
    links: {
      color: '#16a8f0',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: 'bounce',
      random: false,
      speed: 1,
      straight: false
    },
    number: {
      density: {
        enable: true,
      },
      value: 100
    },
    opacity: {
      value: 0.5
    },
    shape: {
      type: 'circle'
    },
    size: {
      value: { min: 1, max: 3 }
    }
  },
  detectRetina: true
};
</script>

<style scoped>
@import "../css/login.css";
</style>
