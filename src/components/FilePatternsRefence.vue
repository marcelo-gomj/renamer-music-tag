<template>
  <div class="w-full  ">
    <div class="pr-6">
      <div class="font-medium text-x1 pt-1 pb-4">Referência dos arquivos</div>

      <div class="flex flex-wrap font-medium rounded-full gap-x-2 gap-y-4 pr-4 w-full">
        <div v-if="meta" 
          v-for="pattern in patternsTagged(meta)" 
          :key="meta[0].path" 
          :class="`flex tracking-wide items-center select-none group gap-4 py-[0.55rem] ${type(pattern) === 'Array'  ? 'pl-5 pr-6 rounded-full cursor-pointer text-x1 bg-base-dark-400 hover:bg-base-dark-600 shadow-[2px_2px_20px] shadow-base-dark-200' : 'px-1.5 text-x2 font-bold text-base-white-800'}`">

          <component :is="type(pattern) === 'Array'  ? Icon[pattern[0]] : null" class="w-[1.05rem] h-[1.05rem]" />
          <div class="leading-[1]">{{ type(pattern) === "Array" ? pattern[0] : pattern }}</div>
        </div>

        <div v-else></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Music2, Captions, Disc, CalendarIcon, Link2, Tag, LucideUsers } from 'lucide-vue-next';
import { MetaResult } from 'src/types/metas-type';
import { inject, watch} from 'vue';
import { toPairs, find, update, type} from "ramda";

const meta = inject<MetaResult[]>("referenceFiles");

function patternsTagged(metaValue: MetaResult[]) : (string | [string])[] {
  if(!metaValue) return [];

  console.log(metaValue[0].metadatas)
  
  return toPairs(metaValue[0].metadatas).reduce((patterns, [tag, { patternIndex }] ) => {
    return update<string | [string]>(patternIndex, [tag], patterns);
  }, metaValue[0].patterns )

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
