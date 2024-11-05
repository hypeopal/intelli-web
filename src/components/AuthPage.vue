<template>
  <div class="login-page">
    <div class="login-logo">Intelli Home</div>
    <router-view/>
    <div class="lang-choose">
      {{ t('language') }}:
      <el-select v-model="locale" style="width: 100px" @change="changeLang">
        <el-option v-for="item in langList" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <div style="margin-left: 10px;">
        {{ t('theme') }}:
        <el-select v-model="userTheme" style="width: 100px;" @change="setTheme(userTheme)">
          <el-option value="light" :label="t('light')"/>
          <el-option value="dark" :label="t('dark')"/>
          <el-option value="auto" :label="t('auto')"/>
        </el-select>
      </div>
    </div>
  </div>

  <vue-particles
      id="tsparticles"
      :particlesLoaded="particlesLoaded"
      :options="options"
  />
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {langList} from "../locales/i18n.js";
import {useTheme} from "../js/UseTheme.js"
import {onMounted} from "vue";

const {t, locale} = useI18n();
const {theme, userTheme, setTheme} = useTheme();
let bgc = '';

const changeLang = () => {
  localStorage.setItem('lang', locale.value);
}
const particlesLoaded = async container => {
  console.log("Particles container loaded", container);
};
const options = {
  background: {
    color: {
      value: `${bgc}`,
    }
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
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
      push: {
        quantity: 4
      },
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
      opacity: 0.6,
      width: 1.5
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: 'bounce',
      random: true,
      speed: 1,
      straight: false
    },
    number: {
      density: {
        enable: true,
      },
      value: 100,
      max: 150
    },
    opacity: {
      value: 0.6
    },
    shape: {
      type: 'circle'
    },
    size: {
      value: {min: 1, max: 3}
    }
  },
  detectRetina: true
};

onMounted(() => {
  if (theme.value === 'light') bgc = '#fff';
  else bgc = '#111';
});
</script>

<style scoped>
@import "../css/login.css";
</style>
