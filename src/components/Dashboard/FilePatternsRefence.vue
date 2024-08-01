<template>
  <div class="w-full">
    <div class="pr-6">
      <div class="font-medium text-x1 pt-1 pb-4">Referência dos arquivos</div>

      <div class="flex flex-wrap font-medium gap-x-2 gap-y-4 pr-4 w-full my-2 min-h-[2.2rem]">
        <div v-if="meta" 
          v-for="pattern in patternsTagged()" 
          :key="meta[0].path" 
          :class="`flex tracking-wide items-center select-none group gap-4 ${type(pattern) === 'Array'  ? 'pl-5 pr-6 rounded-full cursor-pointer text-x1 bg-base-dark-400 hover:bg-base-dark-600 shadow-[2px_2px_20px] shadow-base-dark-200' : 'px-1.5 text-x2 font-bold text-base-white-800'}`">

          <component :is="type(pattern) === 'Array'  ? Icon[pattern[0]] : null" class="w-[1rem] h-[1rem]" />
          <div class="leading-[1]">{{ type(pattern) === "Array" ? pattern[0] : pattern }}</div>
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
import { inject } from 'vue';
import { toPairs, update, type} from "ramda";

const meta = inject<MetaResult[]>("referenceFiles");

function patternsTagged() : (string | [string])[] {
  if(!meta) return [];

  if(meta.length){
    return toPairs(meta[0].metadatas)
    .reduce((patterns, [tag, { patternIndex }] ) => {
      return update<string | [string]>(patternIndex, [tag], patterns);
    }, meta[0].patterns )
  }

  return []

}

const Icon : Record<string, any> = {
  "track" : Music2 ,
  "title" : Captions ,
  "album" : Disc ,
  "feat" : Link2 ,
  "artist" : LucideUsers,
  "disc" : Disc,
  "year":  CalendarIcon,
  "default" : Tag
}
</script>
