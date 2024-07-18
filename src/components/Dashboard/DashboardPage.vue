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
import FilePatternsRefence from './FilePatternsRefence.vue';
import ManageFiles from './ManageFiles.vue';
import MetadatasFields from './MetadatasFields.vue';
</script>