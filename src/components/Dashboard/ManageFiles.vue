<template>
  <div :class="`flex relative group select-none flex-col ${metas ? 'w-[55%]' : 'w-full'} overflow-y-hidden h-full`">
    <ToolsMenu />

    <div class="flex flex-col h-full overflow-y-hidden">
      <div
        v-if="hasSourceDir" 
        class="flex justify-between cursor-pointer items-center font-medium text-x1 tracking-wider pb-2"
        @click="toggleFilesMusicList"
      >
        <div>Arquivos referenciados</div>
  
        <div :class="`group-hover:visible invisible p-1.5 ${openListMusics ? 'rotate-180' : ''}`">
          <ChevronDown :class="`w-5 h-5 stroke-[2.5] `" />
        </div>
  
      </div>

      <div class="flex flex-col h-full overflow-y-hidden">
        <div
          v-if="hasSourceDir" 
          class="relative h-full overflow-y-hidden"
        >
          <div :class="`z-50 h-full overflow-y-scroll hide-scrollbar ${openListMusics ? 'invisible' : ''}`">
            <div class="relative">
              <div v-for="meta of metas"
                class="text-base-white-700 line-clamp-1 pl-6 mr-2 p-4 rounded-sm z-[999] hover:text-base-white-200 text-x1 py-1 font-medium cursor-pointer hover:bg-base-dark-400">
                {{ meta.path }}
              </div>
              <div :class="`absolute w-0.5 rounded-full left-1.5 top-0 h-full bg-base-dark-400 ${openListMusics ? 'invisible' : ''}`" />
            </div>
          </div>
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
import ToolsMenu from "../Dashboard/ToolsMenu.vue";
import { ChevronDown, FolderSearch } from 'lucide-vue-next';
import { MetaResult } from "src/types/metas-type";
import { SourceSelectProps } from "src/types/vue-types";
const filePath = "D:/Músicas/Red Hot Chilly Peppers - 2001 Century";

let openListMusics = ref(false);
const { addSourceDir, currentDir } = inject<SourceSelectProps>("sourceDir");

async function selectFolderSource(){
  const paths = await window.api.explorer.selectMusicsSources(["openDirectory"]);
  addSourceDir(paths)
} 

const hasSourceDir = currentDir;
const metas = inject<MetaResult[]>('referenceFiles');

function toggleFilesMusicList() {
  openListMusics.value = !openListMusics.value;
}
</script>