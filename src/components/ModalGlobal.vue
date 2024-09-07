<template>
  <Transition name="modal" >
    <div 
      class="flex z-[999] items-center overflow-hidden justify-center absolute w-full h-full bg-[rgba(10,10,10,0.4)] top-0 left-0"
      v-if="modalProps.content"
    >
      <div class="border-2 border-base-dark-300 flex relative flex-col max-w-[800px] min-w-[600px] bg-base-dark-200 rounded-2xl">
        <div class="flex justify-center py-3 items-center">
          <div class="font-semibold line-clamp-1 py-2 tracking-wider text-x3">{{ modalProps.title }}</div>
    
          
          <div class="absolute right-2 p-2 opacity-70 rounded-full hover:scale-110 cursor-pointer"
            @click="_ => close()"
          >
            <X class="size-5" />
          </div>
        </div>
    
        <div class="flex flex-col gap-4 relative w-full py-4 px-8 overflow-y-hidden">
          <div class="min-h-52 h-[50vh] overflow-y-hidden">
            <component :is="modalProps.content"  />
          </div>
    
          <div class="flex shrink-0 gap-6 overflow-hidden justify-center w-full text-x2 font-medium ">
            <div class="py-2 w-40 text-center border-[1.5px] border-base-dark-700 hover:border-white bg-base-dark-300 rounded-full cursor-pointer transition-[background-color_150ms_ease]"
              v-if="modalProps.firstButton"
              @click="modalProps.firstButton.fnAction"
            >
              {{ modalProps.firstButton.label }}
            </div>
            <div class="py-2 w-40 text-center border-[1.5px] border-base-dark-400 rounded-full 
             cursor-pointer transition-[background-color_150ms_ease] hover:border-red-600"
              v-if="modalProps.secondButton"  
              @clicl="modalProps.secondButton.fnAction"
            >
             {{  modalProps.secondButton.label }}
            </div>
          </div>
        </div>
    
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { useModal } from '../stores/modal';

const { config, close } = useModal();
const modalProps = config();
</script>
