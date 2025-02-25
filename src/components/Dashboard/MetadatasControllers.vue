<template>
  <div class="flex gap-3">
    <div
      :class="`text-black py-2 cursor-pointer border-[1.5px] font-medium  text-[0.9rem] rounded-3xl px-1  text-center w-52 ${ isSavingMetadatas ? 'bg-none border-base-dark-800 text-white' : 'bg-green-400  hover:bg-green-500  border-base-dark-400 '}`"
      @click="handleClickProcessMetadatas" 
    >
      <div 
        v-if="isSavingMetadatas"
      >
        Salvando...
      </div>
      
      <p
        v-else
      >
        Aplicar Metadatas
      </p>

    </div>

    <div 
      v-if="isSavingMetadatas"
      class="flex text-x1.5 items-center justify-center text-center font-medium border-[1.5px] text-base-white-400 my-[1px] border-base-dark-400 rounded-3xl w-40 hover:border-base-dark-850 transition-[border-color_0.3s_ease] hover:text-base-white-100 cursor-pointer"
    >
      Cancelar
    </div>

    <div
      v-else
      class="flex items-center gap-3"
    >
      <div v-for="{ title, Icon } in tools"
        :title="title"
        class="opacity-50 rounded-md p-3 hover:opacity-100 hover:bg-base-dark-400 cursor-pointer">
        <component :is="Icon" class="w-4 h-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { WandSparkles, Undo2 } from "lucide-vue-next"
import { ref } from "vue";
import * as R from "ramda";
import { useNotification } from "../../stores/notifications";
import { useModal } from "../../stores/modal";
import { h } from "vue";
import ErrorsDetailModalVue from "../ErrorsDetailModal.vue";
import { useMedatas } from "@/stores/metadatas";
import { storeToRefs } from "pinia";
import { usePathSelection } from "@/stores/path-selections";

const { editMusicMetadatas } = window.api.nodeID3;
const isSavingMetadatas = ref(false);

const metadatas = useMedatas();
const { pathSelections } = storeToRefs(usePathSelection());
const { currentMetadatas } = storeToRefs(metadatas);
const { notify } = useNotification(); 
const { show, close } = useModal();

const tools : { title: string, Icon : any, handler: () => void }[] = [
  // { title: 'Tag generated', Icon: WandSparkles, handler: () => { } },
  // { title: 'Reset metadatas', Icon: Undo2, handler: () => { } },
]

async function handleClickProcessMetadatas(){
  isSavingMetadatas.value = true;
  const { updates, errors } = await editMusicMetadatas(
    R.clone(
      pathSelections.value.size ?
      R.pick([...pathSelections.value.keys()], currentMetadatas.value) :
      currentMetadatas.value
    )
  )

  if(R.length(updates)){
    notify({
      title: R.length(updates) + ' dos arquivos foram atualizados',
      id: Date.now(),
      type: 'SUCCESS',
      actionButton: () => { 
        show({
          title: 'Arquivos atulizados',
          content: h(ErrorsDetailModalVue, { paths: updates, type: 'sucess' }),
          firstButton: { label: 'Tentar novamente', fnAction: close }
        })
      }
    })
  }

  if(R.length(errors)){
    notify({
      title: R.length(errors) + ' dos arquivos falharam ao atualizar',
      id: Date.now(),
      type: "ERROR",
      actionButton: () => 
        show({
          content: h(ErrorsDetailModalVue, {
          paths: errors,
          type: 'error'
        })
      })
    })
  }

  isSavingMetadatas.value = false;
}
</script>