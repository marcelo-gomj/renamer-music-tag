<template>
	<div class="flex flex-col gap-6 relative h-[100vh] w-full p-4 px-6">
		<FilePatternsRefence />

		<div class="flex gap-4 overflow-y-hidden h-full">
			<ManageFiles />
			<MetadatasFields />
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, provide, ref, watchEffect } from 'vue';
import FilePatternsRefence from './components/FilePatternsRefence.vue';
import ManageFiles from './components/SystemFiles/ManageFiles.vue';
import MetadatasFields from './components/MetadatasFields.vue';
import { GeneratedMetas } from './types/metas-type';
const {generateMetasByDir} = window.api.metas


const currentDir = ref("");
const metas = ref<GeneratedMetas[]>()

watch(currentDir, async () => {

	const musicFiles = await generateMetasByDir(currentDir.value);
	if(musicFiles){
		metas.value = musicFiles
	}
})

function addSourceDir(sourcePath: string){
	currentDir.value = sourcePath;
}

provide("sourceDir", {
	currentDir,
	addSourceDir
})
provide("referenceFiles", metas)


</script>
