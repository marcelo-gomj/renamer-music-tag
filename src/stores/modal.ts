import { defineStore } from "pinia";
import { ModalGlobalLayoutProps } from "src/types/vue-types";
import { ref } from "vue";

export const useModal = defineStore('modal', () => {
  const modalConfig = ref<ModalGlobalLayoutProps>({ content : '' });

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