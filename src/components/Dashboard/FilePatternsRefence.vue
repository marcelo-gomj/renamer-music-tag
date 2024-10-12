<template>
  <div class="w-full">
    <div  class="h-9">
      <div 
        v-if="pathSelections.size !== 1"
        class="flex gap-8 items-center"
      >
        <div class="font-medium text-x1">Padrão {{ R.toPairs(currentPattern.patternProps)}}</div>
  
        <div class="relative select-none">
          <div 
            class="flex group items-center gap-4 text-x1 h-9 text-base-white-500 font-medium hover:to-base-white-700 cursor-pointer"
            @click="handleTogglePatternList"
          >
            <div class="leading-[0]">Mostrar outros padrões</div>
            <chevron-down class="group-hover:visible invisible size-5" />
          </div>
    
          <div 
            v-show="isOpenPatternList" 
            class="absolute flex -left-2 mt-2 top-full p-2 border-[1px] border-base-dark-850 rounded-lg bg-base-dark-200 z-[900]"
            @mouseleave="handlePatternListLeave"
          >
            <div class="w-auto">
              <div 
                v-for="([patternKey, patterns], index) of R.toPairs(patternReferences)"
                :class="`flex relative items-center gap-5 text-x2 font-medium cursor-pointer rounded-md hover:bg-base-dark-500 text-base-white-500`"
              >
                <div class="space-y-0.5 py-2.5 pl-5 pr-3 ">
                  <div v-show="currentPattern.patternKey === patternKey" 
                    class="w-[3px] py-3 h-[75%] rounded-full bg-white absolute left-1.5"  
                  ></div>
                  <div class="font-bold shrink-0 pt-1 pb-3 leading-[0]">Padrão {{ index + 1 }}</div>
  
                  <div class="flex gap-4 shrink-0">
                    <div 
                      v-for="tag in patterns"
                      class="flex shrink-0 justify-center items-center gap-1 flex-col"
                    >
                      <div class="text-x1">{{ METADATAS[tag]?.label}}</div>
                      <component class="size-3.5" :is="METADATAS[tag]?.icon"  />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex items-center h-9 gap-8 text-x1 font-medium "
      >
        <div>Referência ao arquivo:</div>
        <div 
          class="text-base-white-700"
        >{{ R.last([...pathSelections.keys()][0]?.split(/[\\|/]/)) }}</div>
      </div>
    </div>

    <div class="flex flex-wrap font-medium gap-x-2 gap-y-4 pr-4 w-full mt-2 min-h-[2.2rem]">
      <div 
        v-show="metadatasGenereted.length" 
        v-for="({ isTag, icon, tagName, label }, index) in currentPattern?.patternProps"
        @click="() => activeContextOptions(index)" 
        @mouseleave="handleLeaveContextOptions" 
        :key="(tagName + index)"
        :class="`flex relative tracking-wide items-center select-none group text-x1 gap-4 cursor-pointer ${isTag ? `${index === swapContextActive ? 'bg-base-dark-700' : ''} pl-5 pr-6 rounded-full bg-base-dark-400 shadow-[2px_2px_20px] shadow-base-dark-200` : `${index === swapContextActive ? 'border-green-500' : ''} border-2 rounded-full border-[transparent] cursor-pointer px-2`}`"
      >
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
  </div>
</template>

<script setup lang="ts">
import { Music2, Captions, Disc, ChevronDown, CalendarIcon, User, Tag, TrashIcon, Undo2, Users, Grid2X2 } from 'lucide-vue-next';
import * as R from "ramda";
import { useMedatas } from '@/stores/metadatas';
import { storeToRefs } from 'pinia';
import { PatternList, ReducePatternsObject, ReferencePathsPattern, ReferencePatterns } from '@/types/vue-types'
import { ref, watch } from 'vue';
import { GenMetadatasResult, GenTagKey } from '@/types/metas-type';
import { usePathSelection } from '@/stores/path-selections';

type ReducedPairsPattern = [string, number];

const { metadatasGenereted } = storeToRefs(useMedatas());
const { pathSelections } = storeToRefs(usePathSelection());

const pathReferences = ref<ReferencePathsPattern>({})
const patternReferences = ref<ReferencePatterns>({})
const currentPattern = ref<{ patternKey: string, patternProps: PatternList }>();
const swapContextActive = ref<number | null>(null);
const isOpenPatternList = ref(false);

const getPatternWithMostFrequence = (pathsObj: ReferencePathsPattern) => R.pipe(
  R.countBy(R.identity<string>),
  R.toPairs,
  R.reduce<ReducedPairsPattern, ReducedPairsPattern>(
    (a, b) => (a[1] > b[1] ? a : b),
    ['', 0]
  ),
  R.head
)(R.values(pathsObj)) as string;

const mappingTagPattern = (patterns: ReferencePatterns | string[], patternKey?: string) => ({
  patternKey,
  patternProps : R.map((tagName: (GenTagKey | string)): PatternList[0] => {
    const prop = R.includes('pattern', tagName) ?
      { label: tagName, icon: Grid2X2 } :
      METADATAS[tagName as GenTagKey];

    return ({
      tagName,
      isTag: R.isNotNil(prop?.label),
      icon: prop?.icon,
      label: prop?.label || tagName
    })
  }, R.is(Array, patterns) ? patterns : patterns[patternKey])
})

function watchReferenceMetadatas(metadatasGenereted: GenMetadatasResult[]) {
  const { patterns, pathIndexedByPatterns } = metadatasGenereted.reduce(
    ({ patterns = {}, pathIndexedByPatterns = {} }, { metadatas, path }, index) => {
      const tagList = R.keys(metadatas);
      const patternKey = 'p' + index;

      R.forEachObjIndexed((pattern, patternId) => {
        if (R.equals(tagList, pattern)) {
          pathIndexedByPatterns[path] = String(patternId);
        }
      }, patterns)

      if (!R.hasIn(path, pathIndexedByPatterns)) {
        patterns[patternKey] = tagList;
        pathIndexedByPatterns[path] = patternKey;
      }

      return { pathIndexedByPatterns, patterns }
    },
    {} as ReducePatternsObject
  )

  pathReferences.value = pathIndexedByPatterns;
  patternReferences.value = patterns;
  const popularPattern = getPatternWithMostFrequence(pathIndexedByPatterns) as GenTagKey;
  currentPattern.value =  mappingTagPattern(patterns, popularPattern);
}

function activeContextOptions(tagIndex: number) {
  swapContextActive.value = tagIndex;
}

function handleLeaveContextOptions() {
  swapContextActive.value = null;
}

function handleTogglePatternList(){
  isOpenPatternList.value = !isOpenPatternList.value;
}

function handlePatternListLeave(){
  isOpenPatternList.value = false;
}

const METADATAS: { [key in GenTagKey]?: { label: string, icon: typeof Music2 } } = {
  "trackNumber": { label: "Faixa", icon: Music2 },
  "title": { label: "Título", icon: Captions },
  "album": { label: "Álbum", icon: Disc },
  "artist": { label: "Artista", icon: User },
  "partOfSet": { label: "Volume do disco ", icon: Disc },
  "year": { label: 'Ano', icon: CalendarIcon },
  "genre": { label: 'Genêro', icon: Tag },
  "performerInfo": { label: 'Artistas', icon: Users }
}

const ACTIONS_CONTEXT = [
  { key: 'reset', label: 'Resetar', actionIcon: Undo2, action: () => { } },
  { key: 'delete', label: 'Apagar', actionIcon: TrashIcon, action: () => { } },
]

function watchPathsReferece(paths: Set<string>) {
  swapContextActive.value = null;
  const pathsArray = [...paths.keys()];

  if (paths.size === 1) {
    const meta = R.find(meta => meta.path === pathsArray[0], metadatasGenereted.value);

    const patternKeys = R.reduce(
      (patterns, [tag, { patternIndex }]) => R.update(patternIndex, tag, patterns),
      meta.patterns,
      R.toPairs(meta.metadatas)
    )

    currentPattern.value =  mappingTagPattern(patternKeys);
    return;
  }

  const refs = R.pick(
    pathsArray.length === 0 ? R.keys(pathReferences.value) : pathsArray,
    pathReferences.value
  );

  const patternKey = getPatternWithMostFrequence(refs) as GenTagKey;
  currentPattern.value = mappingTagPattern(patternReferences.value, patternKey);
}

watch(metadatasGenereted, watchReferenceMetadatas);
watch(pathSelections, watchPathsReferece, { deep: true });
</script>
