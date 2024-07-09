<template>
  <div class="flex mt-4 gap-6">
    <div
      class="text-[0.9rem] text-center w-52 font-medium py-2 rounded-3xl px-1 border-2 border-base-dark-400 text-black bg-green-400  hover:bg-green-500 cursor-pointer">
      Aplicar Metadatas
    </div>

    <div class="flex items-center gap-4">
      <div v-for="{ title, Icon } in tools"
        class="opacity-50 rounded-md p-3 hover:opacity-100 hover:bg-base-dark-400 cursor-pointer">
        <component :is="Icon" class="w-4 h-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WandSparkles, Undo2 } from "lucide-vue-next"

const tools = [
  { title: 'Tag generated', Icon: WandSparkles, handler: () => { } },
  { title: 'Reset metadatas', Icon: Undo2, handler: () => { } },
]

</script>