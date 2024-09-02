<template>
  <div :class="`flex gap-4 relative group select-none flex-col ${metas ? 'w-[50%]' : 'w-full'} overflow-y-hidden h-full`">
    <div class="flex gap-2 flex-col h-full overflow-y-hidden">
      <div
        v-if="hasSourceDir" 
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
          v-if="hasSourceDir" 
          class="relative h-full overflow-y-hidden  px-1 py-2 border-[1.5px] border-base-dark-250 rounded-md"
          v-show="openListMusics"  
        >
          <div 
            class="`z-50 h-full overflow-y-scroll hide-scrollbar`"
          >
            <div class="space-y-1">
              <div v-for="meta of metas"
                :class="`relative group/files py-[0.35rem] mr-1 pr-2 rounded-[0.25rem] z-[999] hover:text-base-white-200 text-x1 font-medium cursor-pointer hover:bg-base-dark-300 ${ 
                isPathSelected(meta.path) ? 'text-base-white-300' : 'text-base-white-700'
                }`"
              >
                <div class="flex items-center gap-2">
                  <div
                    :class="`group-hover/files:visible px-1 ${ isPathSelected(meta.path) ? 'visible' : 'invisible'}`"
                    @click=" _ => handleSelectFile(meta.path)"
                  >
                    <component class="size-[1.2rem]" :is="isPathSelected(meta.path) ? CircleCheck : Circle" />
                  </div>
                  
                  <div 
                    @click="_ => handleUniqueSelect(meta.path)"
                    class="line-clamp-1 w-full"
                  >
                    {{ R.last(R.split('\\', meta.path)) }}
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
import { inject, Ref, ref } from "vue";
import ToolsMenu from "../Dashboard/ToolsMenu.vue";
import { ChevronDown, FolderSearch, CircleCheck, Circle, Eye, EyeOff } from 'lucide-vue-next';
import { MetaResult } from "src/types/metas-type";
import { SourceSelectProps } from "src/types/vue-types";
import * as R from "ramda";

const openListMusics = ref(true);
const { addSourceDir, currentDir } = inject<SourceSelectProps>("sourceDir");
const currentReferencesMeta = inject<Ref<string[]>>("currentReferencesMeta");

async function selectFolderSource(){
  const paths = await window.api.explorer.selectMusicsSources(["openDirectory"]);
  addSourceDir(paths)
} 

const hasSourceDir = currentDir;
const metas = inject<MetaResult[]>('referenceFiles');

function toggleFilesMusicList() {
  openListMusics.value = !openListMusics.value;
}

function handleSelectFile(path: string){
  currentReferencesMeta.value = R.ifElse(
    R.includes(path),
    R.without([path]),
    R.append(path)
  )(currentReferencesMeta.value)
}

function handleUniqueSelect(path : string){
  currentReferencesMeta.value = [path]
}

function isPathSelected(path: string){
  return R.includes(path, currentReferencesMeta.value);
}
</script>