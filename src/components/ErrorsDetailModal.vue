<template>
<div class="flex flex-col gap-3 relative text-x1.5 h-full overflow-y-hidden">
  <div class="font-medium sticky top-0 px-2 bg-base-dark-250">Erro nos caminhos:</div>
  
  <div class="flex flex-col h-full w-full overflow-y-hidden">
    <ul class="border-2 border-base-dark-400 space-y-1.5 p-2 overflow-y-scroll h-full ">
      <li 
        class
        v-for="path of failedList"
      >
        <div class="text-red-600 line-clamp-2">{{ path }}</div>
      </li>
    </ul>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, ChevronLeft } from "lucide-vue-next";
const { failedList, successfulList } = defineProps<{
  successfulList : string[],
  failedList : string[]
}>()

</script>