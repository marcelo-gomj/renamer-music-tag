<template>
  <component :is="page" />
</template>

<script setup lang="ts">
import { provide, ref, watch } from 'vue';
import HomePage from "./components/Home/HomePage.vue"
import DashboardPage from './components/Dashboard/DashboardPage.vue';

type RoutesPath = keyof typeof routes;  

  const route = ref('home');
  const page = ref(HomePage)

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

  provide("setRoute", setRoute);
</script>
