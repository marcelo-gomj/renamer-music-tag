<template>
  <div class="w-full">
    <div class="pr-6">
      <div class="font-medium text-x1 pb-4">Referência dos arquivos</div>

      <div class="flex flex-wrap font-medium gap-x-2 gap-y-4 pr-4 w-full my-1 min-h-[2.2rem]">
        <div v-if="meta" 
          v-for="pattern in patternsTagged()" 
          :key="meta[0].path" 
          :class="`flex tracking-wide items-center select-none group gap-4 ${type(pattern) === 'Array'  ? 'pl-5 pr-6 rounded-full cursor-pointer text-x1 bg-base-dark-400 hover:bg-base-dark-600 shadow-[2px_2px_20px] shadow-base-dark-200' : 'px-1.5 text-x2 font-bold text-base-white-800'}`">

          <component :is="type(pattern) === 'Array'  ? Icon[pattern[0]].icon : null" class="w-[1rem] h-[1rem]" />

          <div class="leading-[1]">{{ type(pattern) === "Array" ? (Icon[pattern[0]].label || pattern[0]): pattern }}</div>
        </div>

        <div v-else class="flex justify-between rounded-lg h-full flex-col w-full ">
          <div class="opacity-30 py-1 px-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Music2, Captions, Disc, CalendarIcon, Link2, Tag, LucideUsers } from 'lucide-vue-next';
import { MetaResult } from 'src/types/metas-type';
import { inject, Ref } from 'vue';
import { toPairs, update, type} from "ramda";
import { Tags } from 'src/types/tags';

const meta = inject<Ref<MetaResult[]>>("referenceFiles");

function patternsTagged() : (string | [string])[] {
  if(!meta.value.length) return [];

  if(meta.value.length){
    return toPairs(meta.value[0].metadatas)
    .reduce((patterns, [tag, { patternIndex }] ) => {
      return update<string | [string]>(patternIndex, [tag], patterns);
    }, meta.value[0].patterns )
  }

  return []

}

const Icon : {[tag in keyof Tags & 'default'] ?: { label: string, icon: any}} = {
  "trackNumber" : { label: "Faixa", icon: Music2 } ,
  "title" : { label: "Título", icon: Captions } ,
  "album" : { label: "Álbum", icon: Disc } ,
  "artist" : { label: "Artista", icon: LucideUsers },
  "partOfSet" : { label: "Disco de ", icon: Disc },
  "year":  { label: 'Ano', icon: CalendarIcon },
  "genre" : { label: 'Genêro', icon: Tag},
  "default" : { label: "", icon: Tag }
}
</script>
