<template>
  <div class="flex relative group select-none flex-col w-1/2 overflow-hidden h-full">
    <ToolsMenu />

    <div class="h-full">
      <div
        v-if="hasSourceDir" 
        class="flex justify-between cursor-pointer items-center font-medium text-x1 tracking-wider pb-1.5"
        @click="toggleFilesMusicList"
      >
        <div>{{ currentDir }}</div>
  
        <div :class="`group-hover:visible invisible p-1.5 ${openListMusics ? 'rotate-180' : ''}`">
          <ChevronDown :class="`w-5 h-5 stroke-[2.5] `" />
        </div>
  
      </div>

      <div class="h-full">
        <div
          v-if="hasSourceDir" 
          class="relative h-full overflow-y-hidden"
        >
          <div :class="`z-50 h-full overflow-y-scroll hide-scrollbar ${openListMusics ? 'invisible' : ''}`">
            <div v-for="meta of metas"
              class="text-base-white-700 pl-6 mr-1 rounded-sm z-[999] hover:text-base-white-200 text-x1 py-1 my-0.5 font-medium cursor-pointer hover:bg-base-dark-400">
              {{ meta.path }}
            </div>
          </div>
    
          <div
            :class="`absolute w-0.5 rounded-full left-1.5 top-0 h-full bg-base-dark-400 ${openListMusics ? 'invisible' : ''}`">
          </div>"
    
        </div>

        <div v-else
          class="flex items-center justify-center h-full w-full"
        >
          <div
            class="flex group/folder flex-col items-center gap-4 p-2 cursor-pointer"
            @click="selectFolderSource"
          >
            <div
              class="opacity-20 transition-opacity duration-100 group-hover/folder:opacity-90"
            >
              <FolderSearch class="w-14 h-14" />
            </div>

            <div class="text-x3 font-medium opacity-20">Sem conteúdo</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { inject, ref } from "vue";
import ToolsMenu from "../ToolsMenu.vue";
import { ChevronDown, FolderSearch } from 'lucide-vue-next';
import FilesContainer from './FilesContainer.vue';
import { MetaResult } from "src/types/metas-type";
const filePath = "D:/Músicas/Red Hot Chilly Peppers - 2001 Century";

let openListMusics = ref(false);
const { addSourceDir, currentDir } = inject("sourceDir");
console.log(currentDir.value)

async function selectFolderSource(){
  const [path] = await window.api.explorer.selectMusicsSources();
  addSourceDir(path)
} 

const hasSourceDir = currentDir;
const metas = inject<MetaResult[]>('referenceFiles');

function toggleFilesMusicList() {
  openListMusics.value = !openListMusics.value;
}
</script>