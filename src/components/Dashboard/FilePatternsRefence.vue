<template>
  <div class="w-full">
    <div class="pr-6">
      <div class="font-medium text-x1 pb-4">Referência dos arquivos</div>

      <div class="flex flex-wrap font-medium gap-x-2 gap-y-4 pr-4 w-full my-1 min-h-[2.2rem]">
        <div v-if="metadatasGenereted" 
          v-for="pattern in patternsTagged()" 
          :key="metadatasGenereted[0].path" 
          :class="`flex tracking-wide items-center select-none group gap-4 ${type(pattern) === 'Array'  ? 'pl-5 pr-6 rounded-full cursor-pointer text-x1 bg-base-dark-400 hover:bg-base-dark-600 shadow-[2px_2px_20px] shadow-base-dark-200' : 'px-1.5 text-x2 font-bold text-base-white-800'}`">

          <component :is="type(pattern) === 'Array'  ? METADATAS[pattern[0]].icon : null" class="w-[1rem] h-[1rem]" />

          <div class="leading-[1]">{{ type(pattern) === 'Array' ? (METADATAS[pattern[0]].label || pattern[0]): pattern }}</div>
        </div>

        <div v-else class="flex justify-between rounded-lg h-full flex-col w-full ">
          <div class="opacity-30 py-1 px-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Music2, Captions, Disc, CalendarIcon, Tag, LucideUsers } from 'lucide-vue-next';
import { toPairs, update, type} from "ramda";
import { useMedatas } from '@/stores/metadatas';
import { storeToRefs } from 'pinia';

const { metadatasGenereted } =  storeToRefs(useMedatas());

function patternsTagged() : (string | [string])[] {
  if(!metadatasGenereted.value.length) return [];

  if(metadatasGenereted.value.length){
    return toPairs(metadatasGenereted.value[0].metadatas)
    .reduce((patterns, [tag, { patternIndex }] ) => {
      return update<string | [string]>(patternIndex, [tag], patterns);
    }, metadatasGenereted.value[0].patterns )
  }

  return [];
}

const METADATAS : {[ key : string] : { label: string, icon: typeof Music2 }} = {
  "trackNumber" : { label: "Faixa", icon: Music2 } ,
  "title" : { label: "Título", icon: Captions } ,
  "album" : { label: "Álbum", icon: Disc } ,
  "artist" : { label: "Artista", icon: LucideUsers },
  "partOfSet" : { label: "Disco de ", icon: Disc },
  "year":  { label: 'Ano', icon: CalendarIcon },
  "genre" : { label: 'Genêro', icon: Tag},
  "default" : { label: 'Genêro', icon: Tag},
}
</script>
