import { defineStore } from "pinia";
import { repeat } from "ramda";
import { ModalGlobalLayoutProps } from "src/types/vue-types";
import { h, ref } from "vue";

export const useModal = defineStore('modal', () => {
  const modalConfig = ref<ModalGlobalLayoutProps>({ 
    title: 'Como fazer um cadastro bem feito',
    content : h('div', {}, repeat(' Marcelo Gomes fa', 1000)),
    firstButton: { label: 'Apagar', fnAction: () => {}}
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