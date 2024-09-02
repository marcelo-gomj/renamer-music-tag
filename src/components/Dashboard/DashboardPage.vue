<template>
	<div class="flex flex-col gap-4 relative h-full w-full">
		<FilePatternsRefence />

		<div class="flex gap-6 overflow-y-hidden h-full">
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