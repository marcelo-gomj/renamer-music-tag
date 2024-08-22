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
                :class="`flex items-center gap-3 text-base-white-700 line-clamp-1 pl-2 pr-2 rounded-sm z-[999] hover:text-base-white-200 text-x1 font-medium cursor-pointer hover:bg-base-dark-400 ${ 
                R.includes(meta.path, currentReferencesMeta) ? 'text-base-white-300' : ''}`"
              >
                <div
                  @click="_ => handleSelectFile(meta.path)"
                  class="px-2 h-full"
                >
                  <component 
                    :is="R.includes(meta.path, currentReferencesMeta) ? CircleCheck : Circle" 
                    class="size-[1.15rem] shrink-0"
                  />
                </div>
                
                <div 
                  @click="_ => handleUniqueSelect(meta.path)"
                  class="py-1 line-clamp-1 w-full"
                >
                  {{ R.last(R.split('\\', meta.path)) }}
                </div>
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
import { inject, Ref, ref } from "vue";
import ToolsMenu from "../Dashboard/ToolsMenu.vue";
import { ChevronDown, FolderSearch, CircleCheck, Circle } from 'lucide-vue-next';
import { MetaResult } from "src/types/metas-type";
import { SourceSelectProps } from "src/types/vue-types";
const filePath = "D:/Músicas/Red Hot Chilly Peppers - 2001 Century";
import * as R from "ramda";

const openListMusics = ref(false);
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
</script>