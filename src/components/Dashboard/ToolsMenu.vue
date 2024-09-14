<template>
  <div class="flex px-2 py-3 items-center gap-20">
    <div class="flex text-x0.5 font-medium gap-6 ">
      <div class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center"
        @click="addFileSource"
      >
        <FileSearch class="w-[1rem] h-[1rem]" />
        <p>Arquivos</p>
      </div>
      <div 
        class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center"
        @click="addFolderSource"
      >
        <FolderSearch class="w-[1rem] h-[1rem]" />
        <p>Pastas</p>
      </div>
      
      <div 
        class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center"
      >
        <RefreshCcw class="w-[1rem] h-[1rem]" />
        <p>Atualizar</p>
      </div>

      <div class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center">
        <MoreHorizontal class="w-[1rem] h-[1rem]" />
        <p>Mais</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { inject } from "vue";
import { FileSearch, FolderSearch, RefreshCcw, MoreHorizontal } from "lucide-vue-next";
import { SourceSelectProps } from "src/types/vue-types";
import { OpenDialogOptions } from "electron";
import { useMedatas } from "@/stores/metadatas";

const { selectMusicsSources } = window.api.explorer;
// const { addSourceDir, updateMetaResults } = inject<SourceSelectProps>('sourceDir')
const { updateSource } = useMedatas();

const addSource = (options: OpenDialogOptions["properties"][0]) => async () => {
  const source = await selectMusicsSources([options, 'multiSelections']);
  updateSource(source);
}

const addFolderSource = addSource('openDirectory')
const addFileSource = addSource('openFile');
</script>