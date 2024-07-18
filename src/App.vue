<template>
	<Layout />
</template>

<script setup lang="ts">
import { watch, provide, ref } from 'vue';
import { MetaResult } from './types/metas-type';

import Layout from './Layout.vue';
const {generateMetasByDir} = window.api.metas


const currentDir = ref<string[]>([]);
const metas = ref<MetaResult[]>();

watch(currentDir, async () => {
	const musicFiles = await generateMetasByDir([...currentDir.value]);
	
	if(musicFiles){
		metas.value = musicFiles
		
	}
})

function addSourceDir(sourcePath: string[]){
	currentDir.value = sourcePath;
}

provide("sourceDir", {
	currentDir,
	addSourceDir
})
provide("referenceFiles", metas)


</script>
