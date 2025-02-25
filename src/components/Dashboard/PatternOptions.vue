<script setup lang="ts">
import * as R from "ramda";
import { PatternReferences, CurrentPatternReference } from "@/types/vue/references"
import { METADATAS } from "../constants/metadatas";
import { usePathSelection } from "@/stores/path-selections";
import { storeToRefs } from "pinia";

const { pathSelections } = storeToRefs(usePathSelection());

type PropsOptions = {
  isOpenPatternList: boolean,
  handlePatternListLeave: () => void,
  patternReferences: PatternReferences,
  handleSelectPattern: (patternKey: string) => void,
  currentPattern : CurrentPatternReference
}

const { patternReferences, currentPattern } = defineProps<PropsOptions>();


</script>

<template>
  <div 
    v-show="isOpenPatternList"
    class="absolute overflow-y-scroll max-h-[80vh] flex -left-2 mt-2 top-full p-2 border-[1px] border-base-dark-850 rounded-lg bg-base-dark-200 z-[900]"
    @mouseleave="handlePatternListLeave"
  >
    <div class="w-auto min-w-52">
      <div v-for="([patternKey, patterns], index) of R.toPairs(patternReferences)"
        @click="() => handleSelectPattern(patternKey)"
        :class="`flex relative items-center gap-5 text-x2 font-medium cursor-pointer rounded-md hover:bg-base-dark-500 text-base-white-500`"
      >
        <div class="space-y-0.5 py-2.5 pl-5 pr-3">
          
          <div 
            v-show="currentPattern.patternKey === patternKey"
            class="w-[3px] py-3 h-[75%] rounded-full bg-white absolute left-1" 
          />

          <div class="font-bold shrink-0 pt-1 pb-3 leading-[0]">{{
            patternKey === 'all' ?  'Todos os padrões' : `Padrão ${index + 1}`
          }}</div>

          <div v-if="patternKey !== 'all'" class="flex gap-4 shrink-0">
            <div v-for="tag in patterns" class="flex shrink-0 justify-center items-center gap-1 flex-col">
              <div class="text-x1">{{ METADATAS[tag]?.label }}</div>
              <component class="size-3.5" :is="METADATAS[tag]?.icon" />
            </div>
          </div>

          <div v-else class="text-x0.5">
            Todos os padrões mesclados sem ordem
          </div>
        </div>
      </div>
    </div>
  </div>
</template>