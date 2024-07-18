<template>
  <div class="flex relative justify-center items-center w-[100%] h-[100vh] overflow-y-hidden">
    <div class="flex flex-col w-[500px] h-full overflow-y-hidden">

      <div class="flex space-y-2 items-center flex-col py-8">
        <div class="font-medium text-3xl text-base-white-200">Renamer Auto Software</div>
        <p class="text-x2 text-base-white-600">Generate music metadados automatically</p>
      </div>
      
      <div class="flex font-medium justify-evenly w-full py-6">
        <div class="flex border-[1.5px] border-base-dark-700 rounded-xl h-36 w-40 justify-center items-center opacity-40 flex-col space-y-4 cursor-pointer hover:border-base-white-900 hover:opacity-90 transition-[opacity_150ms_ease]"
          @click="openFile"
        >
          <FileSearch class="size-14 stroke-[1.5]" />
          <p class="text-x2">Abrir Arquivos</p>
        </div>

        <div class="flex border-[1.5px] border-base-dark-700 rounded-xl h-36 w-40 justify-center items-center opacity-40 flex-col space-y-4 cursor-pointer hover:border-base-white-900 hover:opacity-90 transition-[opacity_150ms_ease]"
          @click="openFolder"
        >
          <FolderSearch class="size-14 stroke-[1.5]"/>
          <p class="text-x2">Abrir Pastas</p>
        </div>
      </div>

      <footer 
        class="flex flex-col h-full overflow-y-hidden py-4"
      
      >
        <div class="text-x1.5 font-medium py-2">Arquivos recentes</div>
        
        <div class="space-y-1 text-x1 overflow-y-scroll">
          <div
            v-for="folder in filesRecents"
            class=" hover:bg-base-dark-400 hover:text-white px-2 mr-2 rounded-md text-base-white-600 py-1 cursor-pointer"
          >
          {{ folder }}
        </div>
        </div>
      </footer>
    </div>

  </div>
</template>

<script setup lang="ts">
import { OpenDialogOptions } from 'electron';
import { FileSearch, FolderSearch } from 'lucide-vue-next';
import { RoutePath, SourceSelectProps } from 'src/types/vue-types';
import { inject } from 'vue';
const { selectMusicsSources } = window.api.explorer


const { addSourceDir } = inject<SourceSelectProps>("sourceDir")
const setRoute = inject<RoutePath>('setRoute')
const selectSourceMode = async (mode: OpenDialogOptions["properties"]) => {
  addSourceDir(await selectMusicsSources(mode));
  setRoute('dashboard')
}
const openFolder = () => selectSourceMode(['openDirectory'])
const openFile = () => {selectSourceMode(['openFile'])}

const filesRecents = [
  "D:/music/Paramore",
  "D:/music/Nirvana",
  "D:/DISC-3/Sublime",
  "D:/music/Paramore",
  "D:/music/Nirvana",
  "D:/DISC-3/Sublime",
  "D:/music/Paramore",
  "D:/music/Nirvana",
  "D:/DISC-3/Sublime",
  "D:/music/Paramore",
  "D:/music/Nirvana",
  "D:/DISC-3/Sublime"
]
</script>