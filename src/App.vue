<template>
	<div class="flex relative flex-col h-[100vh] w-full overflow-hidden">
		<div class="flex justify-between shrink-0 items-center px-6 h-10 w-full bg-base-dark-200 draggable">
			<p class="font-bold text-x2">GenTagger</p>

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
import { provide, ref } from 'vue';
import SideNotifications from './components/NotificationsGlobal.vue';
import ModalGlobal from './components/ModalGlobal.vue';
import { X } from 'lucide-vue-next';
import { useRoute } from './stores/route';

const currentReferencesMeta = ref<string[]>([]);

const router = useRoute();


provide('currentReferencesMeta', currentReferencesMeta);
</script>
