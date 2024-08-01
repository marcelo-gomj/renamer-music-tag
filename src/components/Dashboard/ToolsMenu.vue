<template>
  <div class="flex py-3 items-center gap-20 mb-2">
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
        @click="updateFiles"
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

const { selectMusicsSources } = window.api.explorer;
const { addSourceDir, updateMetaResults } = inject<SourceSelectProps>('sourceDir')

const addSource = (options: OpenDialogOptions["properties"][0]) => async () => {
  const source = await selectMusicsSources([options, 'multiSelections']);
  addSourceDir(source);
}
const addFolderSource = addSource('openDirectory')
const addFileSource = addSource('openFile');

const updateFiles = () => { 
  updateMetaResults()
}

</script>