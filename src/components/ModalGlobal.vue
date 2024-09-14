<template>
  <Transition name="modal" >
    <div 
      class="flex z-[999] items-center overflow-hidden justify-center absolute w-full h-full bg-[rgba(10,10,10,0.4)] top-0 left-0"
      v-if="modalProps.content"
    >
      <div class="border-base-dark-900 flex relative flex-col w-[700px] bg-base-dark-200 rounded-xl">
        <div class="flex relative justify-center h-12 items-center">
          <div 
            class="font-semibold text-center w-full line-clamp-1 tracking-wider text-x3"
            :title="modalProps.title"
          >
            {{ modalProps.title }}
          </div>
    
          <div class="flex absolute items-center h-full right-0 px-4  opacity-70 hover:scale-110 cursor-pointer"
            @click="_ => close()"
          >
            <X class="size-6 stroke-[2.5]" />
          </div>
        </div>
    
        <div class="flex flex-col gap-4 relative w-full py-4 px-6 overflow-y-hidden">
          <div class="min-h-52 h-[50vh] overflow-hidden px-2">
            <component :is="modalProps.content"  />
          </div>
    
          <div class="flex shrink-0 gap-6 overflow-hidden justify-center w-full text-x2 font-medium ">
            <div class="py-2 w-44 text-center border-[1.5px] border-base-dark-700 hover:border-white bg-base-dark-300 rounded-full cursor-pointer transition-[background-color_150ms_ease]"
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
