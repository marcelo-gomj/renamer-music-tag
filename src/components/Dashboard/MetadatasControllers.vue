<template>
  <div class="flex gap-3">
    <div
      class="text-[0.9rem] text-center w-52 font-medium py-2 rounded-3xl px-1 border-2 border-base-dark-400 text-black bg-green-400  hover:bg-green-500 cursor-pointer"
      @click="handleClickProcessMetadatas" 
    >
      Aplicar Metadatas
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
import { CurrentMetaSave } from "src/types/metas-type";
import { inject, Ref, ref } from "vue";
import * as R from "ramda";

const { editMusicMetadatas } = window.api.nodeID3;
const isSavingMetadatas = ref(false);

const {
  currentMetadatas, 
} = defineProps<{
  currentMetadatas: CurrentMetaSave,
}>()

const setIsProcessing = inject<Ref<boolean>>('setIsProcessing');
const current = inject<() => CurrentMetaSave>('current')

const tools = [
  { title: 'Tag generated', Icon: WandSparkles, handler: () => { } },
  { title: 'Reset metadatas', Icon: Undo2, handler: () => { } },
]


async function handleClickProcessMetadatas(){
  setIsProcessing.value = true;
  isSavingMetadatas.value = true;
  console.log('init', current())

  const da = current()
  const result = await editMusicMetadatas(R.clone(da));

  console.log([result.errors, result.updates])

  setIsProcessing.value = false;
  isSavingMetadatas.value = false;
}

</script>