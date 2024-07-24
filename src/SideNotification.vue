<template>
<div class="flex items-center justify-center absolute w-full h-full bg-[rgba(10,10,10,0.4)] top-0 left-0"
  v-if="!!content"
>
  <div class="flex relative flex-col p-2 w-2/3 h-2/3 bg-base-dark-250 rounded-2xl">
    <div class="flex justify-center py-1 items-center">
      <div class="font-medium text-x2">{{ title }}</div>

      <div class="absolute right-3 p-2 rounded-full cursor-pointer"
        @click="()=> closeModal()"
      >
        <X class="size-5" />
      </div>
    </div>

    <div class="relative h-full w-full my-2 overflow-y-hidden">
      <component :is="content"  /> 
    </div>

    <div class="flex justify-center w-full text-x2 font-medium gap-3">
      <div class="py-2 px-8 bg-base-dark-300 rounded-full hover:bg-base-dark-600 cursor-pointer transition-[background-color_150ms_ease]"
        v-if="firstButton"
        @click="firstButton.fnAction"
      >
        {{ firstButton.label }}
      </div>
      <div class="py-2 px-8 border-[1.5px] border-green-900 bg-base-dark-300 rounded-full hover:bg-base-dark-600 cursor-pointer transition-[background-color_150ms_ease]"
        v-if="secondButton"  
        @clicl="secondButton.fnAction"
      >
       {{  secondButton.label }}
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { NotificationLayoutProps } from './types/vue-types';
const { 
  content, title, 
  secondButton, 
  firstButton, 
  closeModal 
} = defineProps<NotificationLayoutProps>()

</script>
