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
import { watch, provide, ref, h, unref } from 'vue';
import HomePage from "./components/Home/HomePage.vue"
import DashboardPage from './components/Dashboard/DashboardPage.vue';
import SideNotification from './SideNotification.vue';
import ErrorsDetailModal from './components/ErrorsDetailModal.vue';
import { NotificationLayoutProps } from './types/vue-types';
import { MetaResult } from './types/metas-type';
import ConfigPage from './components/Config/ConfigPage.vue';

const { generateMetasByDir } = window.api.metas

const currentDirSource = ref<string[]>([]);
const metas = ref<MetaResult[]>([]);
const route = ref('home');
const page = ref(HomePage)
const noticationConfig = ref<NotificationLayoutProps>({})

const routes = {
	"home": HomePage,
	"config": ConfigPage,
	"dashboard": DashboardPage,
	"default": HomePage
}

type RoutesPath = keyof typeof routes;

const setRoute = (path: RoutesPath) => {
	route.value = path
}

const closeModal = () => {
	noticationConfig.value = {}
}

const setNotification = (config: Omit<NotificationLayoutProps, "closeModal">) => {
	noticationConfig.value = config;
}

const addSourceDir = (sourcePath: string[]) => {
	currentDirSource.value = sourcePath;
}

const continueWithoutCheck = () => {
	setNotification({})
}

const updateMetaResults = async (paths ?: string[]) => {
	const { error, results } = await generateMetasByDir( paths || [...currentDirSource.value]);
	
	if(results){
		const metadatas = [ 
			...(paths ? unref(metas.value) : []), 
			...results
		]

		metas.value = metadatas;
	}

	return { error, results }
}

const watchDirSourceChange = async () => {
	const { 
		results, 
		error
	} = await updateMetaResults();

	if (error?.pathErrors.length) {
		setNotification({
			title: 'Erro ao adicionar fontes',
			content: h(ErrorsDetailModal, {
				failedList: error.pathErrors, successfulList: results.map( result => result.path)
			}),
			firstButton: { 
				label: "tentar novamente", 
				fnAction: () => updateMetaResults(error.pathErrors) 
			},
			secondButton: { 
				label: "continuar mesmo assim", 
				fnAction: continueWithoutCheck
			},
		})
	}
}

const watchRouteChange = () => {
	const path = (route.value || "default") as RoutesPath;
	page.value = routes[path]
}

watch(currentDirSource, watchDirSourceChange);
watch(route, watchRouteChange);

provide("sourceDir", { currentDir: currentDirSource, addSourceDir, updateMetaResults })
provide("referenceFiles", metas)
provide("setRoute", setRoute);
provide('setNotificationModal', setNotification)
</script>
