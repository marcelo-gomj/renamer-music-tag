<template>
  <component :is="page" />
  
  <side-notification  
    :title="noticationConfig.title"
    :content="noticationConfig.content" 
    :close-modal="closeModal"
    :first-button="noticationConfig.firstButton"
    :second-button="noticationConfig.secondButton"
  />
  
</template>

<script setup lang="ts">
import { provide, reactive, ref, watch } from 'vue';
import HomePage from "./components/Home/HomePage.vue"
import DashboardPage from './components/Dashboard/DashboardPage.vue';
import SideNotification from './SideNotification.vue';
import { NotificationLayoutProps } from './types/vue-types';

type RoutesPath = keyof typeof routes;  

  const route = ref('home');
  const page = ref(HomePage)
  const noticationConfig = ref<NotificationLayoutProps>({})

  const routes = {
    "home" :  HomePage,
    "config" : HomePage,
    "dashboard" : DashboardPage,
    "default" : HomePage
  }

  watch(route, () => {
    const path = (route.value || "default" ) as RoutesPath;
    page.value = routes[path] 
  })

  const setRoute = (path: RoutesPath) => {
    route.value = path
  }

  function closeModal(){
    noticationConfig.value = {}
  }

  function setNotification(config: Omit<NotificationLayoutProps, "closeModal">){
    noticationConfig.value = config;

  }

  provide("setRoute", setRoute);
  provide('setNotificationModal', setNotification)
</script>
