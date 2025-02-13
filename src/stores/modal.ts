import { defineStore } from "pinia";
import { repeat } from "ramda";
import { ModalGlobalLayoutProps } from "@/types/vue/vue-types";
import { h, ref } from "vue";

export const useModal = defineStore('modal', () => {
  const modalConfig = ref<ModalGlobalLayoutProps>({ 
    content: null
  });

  function show(modalProps: ModalGlobalLayoutProps){
    modalConfig.value = modalProps ;
  }

  function close(){
    modalConfig.value = { content: '' };
  }

  function config(){
    return modalConfig
  }

  return {
    config,
    show,
    close
  }
})