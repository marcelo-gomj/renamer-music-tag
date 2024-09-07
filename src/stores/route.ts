import { defineStore } from "pinia";

import HomePage from "../components/Home/HomePage.vue";
import ConfigPage from "../components/Config/ConfigPage.vue";
import DashboardPage from "../components/Dashboard/DashboardPage.vue";
import { ref, watch } from "vue";

export const useRoute = defineStore('route', () => {
  const routes = {
    "home": HomePage,
    "config": ConfigPage,
    "dashboard": DashboardPage,
    "default": HomePage
  }

  type paths = keyof typeof routes;

  const pathRoute = ref<paths>('home');
  const page = ref(HomePage)

  function route(path: paths){
    pathRoute.value = path;
  }

  watch(pathRoute, () => {
    page.value = routes[pathRoute.value]
  })

  return {
    route,
    page
  }
})