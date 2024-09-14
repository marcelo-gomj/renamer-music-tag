<template>
<div class="relative text-x1.5 py-2 h-full overflow-y-hidden">  
  <div class="flex flex-col px-2 py-4 h-full w-full rounded-xl overflow-y-hidden">
    <ul class="space-y-3 px-2 pr-6 overflow-y-scroll h-full ">
      <li 
        class="group flex gap-4 items-center w-full font-medium text-x1 cursor-pointer"
        v-for="path of paths"
      >
          <div :class="[typeColor[type], ` line-clamp-2 group-hover:text-base-white-200`]">{{ path }}</div>
          <ExternalLink class="size-4 invisible group-hover:visible" />
      </li>
    </ul>
  </div>
</div>
</template>

<script setup lang="ts">
import { ExternalLink } from "lucide-vue-next";
const { paths, type } = defineProps<{
  paths: string[],
  type: 'error' | 'sucess'
}>()

const typeColor = {
  'error' : 'text-red-500',
  'sucess' : 'text-green-500'
}

</script>