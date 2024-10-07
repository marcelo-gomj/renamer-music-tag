<template>
  <div :class="`flex gap-4 relative group select-none flex-col w-full overflow-y-hidden h-full`">
    <div class="flex gap-2 flex-col h-full overflow-y-hidden">
      <div
        v-if="sourceDirectory" 
        class="flex justify-between cursor-pointer py-1.5 items-center font-medium text-x1 tracking-wider"
        @click="toggleFilesMusicList"
      >
        <div class="leading-[0]">Arquivos referenciados</div>
  
        <div :class="`group-hover:visible invisible px-1 h-full ${openListMusics ? 'rotate-180' : ''}`">
          <ChevronDown :class="`w-5 h-5 stroke-[2.5] `" />
        </div>
  
      </div>

      <div class="flex flex-col h-full overflow-y-hidden">
        <div
          v-if="sourceDirectory" 
          class="relative h-full overflow-y-hidden  px-1 py-2 border-[1.5px] border-base-dark-250 rounded-md"
          v-show="openListMusics"  
        >
          <div 
            class="`z-50 h-full overflow-y-scroll custom-scrollbar `"
          >
            <div class="space-y-1">
              <div v-for="{ path } of metadatasGenereted"
                :class="`relative group/files  mr-1 rounded-[0.25rem] z-[500] hover:text-base-white-200 text-x1 font-medium cursor-pointer hover:bg-base-dark-300 ${ 
                isPathSelected(path) ? 'text-base-white-300' : 'text-base-white-700'
                }`"
              >
                <div class="flex items-center"
                >
                  <div
                    :class="`group-hover/files:visible h-full py-[0.35rem] px-2 ${ isPathSelected(path) ? 'visible' : 'invisible'}`"
                    @click=" _ => selectPath(path)"
                  >
                    <component class="size-[1.2rem]" :is="isPathSelected(path) ? CircleCheck : Circle" />
                  </div>
                  
                  <div 
                    class="line-clamp-1 w-full py-[0.35rem] pr-2"
                    @click="_ => selectOnePath(path)"
                  >
                    {{ R.last(R.split(/[\\|/]/ig, path)) }}
                  </div>
                </div>
              </div>
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
 
    <ToolsMenu />
  </div>
</template>

<script setup lang="ts">
import { inject, Ref, ref, watch } from "vue";
import ToolsMenu from "../Dashboard/ToolsMenu.vue";
import { ChevronDown, FolderSearch, CircleCheck, Circle, Eye, EyeOff } from 'lucide-vue-next';
import * as R from "ramda";
import { useMedatas } from "@/stores/metadatas";
import { storeToRefs } from "pinia";
import { usePathSelection } from "@/stores/path-selections";


const openListMusics = ref(true);
const metadatas = useMedatas();
const { sourceDirectory, metadatasGenereted } = storeToRefs(metadatas);
const usePaths = usePathSelection();
const { pathSelections } = storeToRefs(usePaths);
const { selectPath, selectOnePath, isPathSelected } = usePaths;

async function selectFolderSource(){
  const paths = await window.api.explorer.selectMusicsSources(["openDirectory"]);
  // addSourceDir(paths)
} 

function toggleFilesMusicList() {
  openListMusics.value = !openListMusics.value;
}
</script>