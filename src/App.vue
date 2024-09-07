<template>
	<div class="flex relative flex-col h-[100vh] w-full overflow-hidden">
		<div class="flex justify-between shrink-0 items-center px-6 h-10 w-full bg-base-dark-200 draggable">
			<p class="font-bold text-x2">Renamer Music Tag</p>

			<div class="group/close cursor-pointer">
				<X class="size-5 opacity-40 group-hover/close:opacity-100 stroke-[1.5]" />
			</div>
		</div>

		<div class="relative py-4 px-6 h-full overflow-hidden">
			<component :is="router.page" />
			<SideNotifications />
			<ModalGlobal />
		</div>
	</div>	
	
</template>

<script setup lang="ts">
import { watch, provide, ref, unref } from 'vue';
import SideNotifications from './components/NotificationsGlobal.vue';
import ModalGlobal from './components/ModalGlobal.vue';
import { MetaResult } from './types/metas-type';
import { X } from 'lucide-vue-next';
import { useRoute } from './stores/route';

const { generateMetasByDir } = window.api.metas

const currentDirSource = ref<string[]>([]);
const metas = ref<MetaResult[]>([]);
const currentReferencesMeta = ref<string[]>([]);

const router = useRoute();

const addSourceDir = (sourcePath: string[]) => {
	currentDirSource.value = sourcePath;
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
}

watch(currentDirSource, watchDirSourceChange);

provide("sourceDir", { currentDir: currentDirSource, addSourceDir, updateMetaResults })
provide("referenceFiles", metas)
provide('currentReferencesMeta', currentReferencesMeta);
</script>
