<template>
  <div class="w-full">
    <div class="pr-6">
      <div class="font-medium text-x1 pb-4">Referência dos arquivos</div>

      <div class="flex flex-wrap font-medium gap-x-2 gap-y-4 pr-4 w-full my-1 min-h-[2.2rem]">
        <div 
          v-if="metadatasGenereted" 
          v-for="({ isTag, icon, tagName, label }, index) in currentPattern" 
          @click="() => activeContextOptions(index)"
          :key="(tagName + index)"
          :class="`flex relative tracking-wide items-center select-none group gap-4 cursor-pointer ${ isTag ? `pl-5 ${ index === swapContextActive ? 'pr-3' : 'pr-6'} rounded-full text-x1 bg-base-dark-400 hover:bg-base-dark-600 shadow-[2px_2px_20px] shadow-base-dark-200` : 'cursor-pointer px-2'}`"
        >
          <component :is="icon" class="w-[1rem] h-[1rem]" />
          <div class="leading-[1]">{{ label }}</div>

          <div
            v-show="index === swapContextActive"
          >
            <X class="size-5" />
          </div>

          <div 
            class="absolute top-full mt-2 rounded-2xl left-0 bg-base-dark-250 z-[999] p-2"
            v-show="index === swapContextActive"
          >
            <div 
              v-for="{icon, label } in METADATAS"
              class="flex w-52 px-5 py-2"
            >
              <div>{{ label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Music2, Captions, Disc, CalendarIcon, Tag, LucideUsers, Users, Grid2X2, X } from 'lucide-vue-next';
import * as R from "ramda";
import { useMedatas } from '@/stores/metadatas';
import { storeToRefs } from 'pinia';
import { PatternList, ReducePatternsObject, ReferencePathsPattern, ReferencePatterns } from '@/types/vue-types'
import { ref, shallowReactive, watch } from 'vue';
import { GenMetadatasResult, GenTagKey } from '@/types/metas-type';
import { usePathSelection } from '@/stores/path-selections';

type ReducedPairsPattern = [string, number];

const { metadatasGenereted } = storeToRefs(useMedatas());
const { pathSelections } = storeToRefs(usePathSelection());

const pathReferences = ref<ReferencePathsPattern>({})
const patternReferences = ref<ReferencePatterns>({})
const currentPattern = ref<PatternList>([]);
const swapContextActive = ref<number | null>(null);

const getPatternWithMostFrequence = (pathsObj: ReferencePathsPattern) => R.pipe(
  R.countBy(R.identity<string>),
  R.toPairs,
  R.reduce<ReducedPairsPattern, ReducedPairsPattern>((a, b) => 
    (a[1] > b[1] ? a : b),
    ['', 0]
  ),
  R.head
)(R.values(pathsObj)) as string;

function watchReferenceMetadatas(metadatasGenereted: GenMetadatasResult[]) {
  const { patterns, pathIndexedByPatterns} =   metadatasGenereted.reduce(
    ({ patterns = {} , pathIndexedByPatterns = {} }, { metadatas, path }, index) => {
      const tagList = R.keys(metadatas);
      const patternKey = 'p' + index;
      
      R.forEachObjIndexed((pattern, patternId) => {
        if(R.equals(tagList, pattern)){
          pathIndexedByPatterns[path] = String(patternId);
        }
      }, patterns)

      if(!R.hasIn(path, pathIndexedByPatterns)){
        patterns[patternKey] = tagList;
        pathIndexedByPatterns[path] = patternKey;
      }
      
      return { pathIndexedByPatterns, patterns }
    }, 
    {} as ReducePatternsObject
  )

  pathReferences.value = pathIndexedByPatterns;
  patternReferences.value = patterns;
  const popularPattern =  getPatternWithMostFrequence(pathIndexedByPatterns) as GenTagKey;
  currentPattern.value = mappingTagPattern(patterns[popularPattern]);
}

function activeContextOptions(tagIndex: number){
  swapContextActive.value = tagIndex;
}

const METADATAS: { [key in GenTagKey] ?: { label: string, icon: typeof Music2 } } = {
  "trackNumber": { label: "Faixa", icon: Music2 },
  "title": { label: "Título", icon: Captions },
  "album": { label: "Álbum", icon: Disc },
  "artist": { label: "Artista", icon: LucideUsers },
  "partOfSet": { label: "Disco de ", icon: Disc },
  "year": { label: 'Ano', icon: CalendarIcon },
  "genre": { label: 'Genêro', icon: Tag },
  "performerInfo": { label: 'Artistas', icon: Users }
}

const mappingTagPattern = R.map((tagName: (GenTagKey| string)) : PatternList[0] => {

  const prop = R.includes('pattern', tagName) ?
  { label: tagName, icon: Grid2X2 } : 
  METADATAS[tagName as GenTagKey];
  
  return ({
    tagName,
    isTag: R.isNotNil(prop?.label),
    icon: prop?.icon,
    label: prop?.label || tagName
  })
})

function watchPathsReferece(paths: Set<string>){
  swapContextActive.value = null;
  const pathsArray = [...paths.keys()];
  
  if(paths.size === 1){
    const meta = R.find( meta => meta.path === pathsArray[0] , metadatasGenereted.value);
    
    const patternKeys = R.reduce(
        (patterns, [tag, { patternIndex }]) => R.update(patternIndex, tag, patterns), 
        meta.patterns, 
      R.toPairs(meta.metadatas)
    )

    currentPattern.value = mappingTagPattern(patternKeys)
    return;
  }
  
  const refs = R.pick(
    pathsArray.length === 0 ? R.keys(pathReferences.value) : pathsArray, 
    pathReferences.value
  );

  const patternKey = getPatternWithMostFrequence(refs) as GenTagKey;
  currentPattern.value = mappingTagPattern(patternReferences.value[patternKey] || [])
}

watch(metadatasGenereted, watchReferenceMetadatas);
watch(pathSelections, watchPathsReferece, { deep : true });
</script>
