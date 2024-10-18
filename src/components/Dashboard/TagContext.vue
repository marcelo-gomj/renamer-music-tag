<script setup lang="ts">
import { TrashIcon, Undo2 } from 'lucide-vue-next';
import { METADATAS } from '../constants/metadatas';
import { useMedatas } from "@/stores/metadatas";
import { storeToRefs } from 'pinia';
import { CurrentPatternReference } from '@/types/vue-types';

const { swapContextActive, currentPattern } = defineProps<{
  swapContextActive : number,
  currentPattern:  CurrentPatternReference,
  activeContextOptions: (index : number) => void,
  handleLeaveContextOptions: () => void
}>()

const { metadatasGenereted } = storeToRefs(useMedatas());

const ACTIONS_CONTEXT = [
  { key: 'reset', label: 'Resetar', actionIcon: Undo2, action: () => { } },
  { key: 'delete', label: 'Apagar', actionIcon: TrashIcon, action: () => { } },
]
</script>

<template>
  <div class="flex flex-wrap font-medium gap-x-2 gap-y-4 pr-4 w-full mt-2 min-h-[2.2rem]">
    <div v-show="metadatasGenereted.length"
      v-for="({ isTag, icon, tagName, label }, index) in currentPattern?.patternProps"
      @click="() => activeContextOptions(index)" @mouseleave="handleLeaveContextOptions" :key="(tagName + index)"
      :class="`flex relative tracking-wide items-center select-none group text-x1 gap-4 cursor-pointer ${isTag ? `${index === swapContextActive ? 'bg-base-dark-700' : ''} pl-5 pr-6 rounded-full bg-base-dark-400 shadow-[2px_2px_20px] shadow-base-dark-200` : `${index === swapContextActive ? 'border-green-500' : ''} border-2 rounded-full border-[transparent] cursor-pointer px-2`}`">
      <component :is="icon" class="w-[1rem] h-[1rem]" />
      <div :class="`leading-[1] ${isTag ? '' : 'font-bold'}`">{{ label }}</div>

      <div class="absolute top-full left-0 z-[999]">
        <div class="rounded-xl mt-2 bg-base-dark-250  p-2" v-show="index === swapContextActive">
          <div class="flex gap-6 px-4 pt-1 pb-3 mb-1 border-base-dark-600 border-b-2">
            <div v-for="{ actionIcon, key, label, action } in ACTIONS_CONTEXT" :key="key" :title="label"
              @click="action">
              <component class="size-5" :is="actionIcon" />
            </div>
          </div>

          <div v-for="{ label: sublabel, icon } in METADATAS" v-show="sublabel !== label"
            class="flex items-center gap-6 w-52 px-5 py-2 rounded-lg hover:bg-base-dark-700">
            <component :is="icon" class="size-4" />
            <div>{{ sublabel }}</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

