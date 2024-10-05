<template>
  <div class="w-full">
    <div class="pr-6">
      <div class="font-medium text-x1 pb-4">Referência dos arquivos</div>

      <div class="flex flex-wrap font-medium gap-x-2 gap-y-4 pr-4 w-full my-1 min-h-[2.2rem]">
        <div 
          v-if="metadatasGenereted" 
          v-for="(pattern, index) in currentPattern" 
          :key="(R.is(String, pattern) ? pattern : pattern.tagName) + index "
          :class="`flex tracking-wide items-center select-none group gap-4 ${'pl-5 pr-6 rounded-full cursor-pointer text-x1 bg-base-dark-400 hover:bg-base-dark-600 shadow-[2px_2px_20px] shadow-base-dark-200'}`"
        >

          <component :is="R.is(String, pattern) ? '' : pattern.icon" class="w-[1rem] h-[1rem]" />

          <div class="leading-[1]">{{ R.is(String, pattern) ? pattern : (pattern.label || pattern.tagName)}}
          </div>
        </div>
        <div v-else class="flex justify-between rounded-lg h-full flex-col w-full ">
          <div class="opacity-30 py-1 px-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Music2, Captions, Disc, CalendarIcon, Tag, LucideUsers, Users } from 'lucide-vue-next';
import * as R from "ramda";
import { useMedatas } from '@/stores/metadatas';
import { storeToRefs } from 'pinia';
import { PatternList, ReducePatternsObject, ReferencePathsPattern, ReferencePatterns } from '@/types/vue-types'
import { ref, watch } from 'vue';
import { GenMetadatasResult, GenTagKey } from '@/types/metas-type';
import { usePathSelection } from '@/stores/path-selections';

type ReducedPairsPattern = [string, number];

const { metadatasGenereted, currentMetadatas } = storeToRefs(useMedatas());
const { pathSelections } = storeToRefs(usePathSelection());

const pathReferences = ref<ReferencePathsPattern>({})
const patternReferences = ref<ReferencePatterns>({})
const currentPattern = ref<PatternList>([]);

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
  // currentPattern.value = getPatternWithMostFrequence(pathIndexedByPatterns);
  const popularPattern =  getPatternWithMostFrequence(pathIndexedByPatterns) as GenTagKey;
  currentPattern.value = patterns[popularPattern];
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

function watchPathsReferece(paths: Set<string>){
  const pathsArray = [...paths.keys()];
  
  if(paths.size === 1){
    const meta = R.find( meta => meta.path === pathsArray[0] , metadatasGenereted.value);
    console.log(meta)
    
    currentPattern.value = R.reduce((patterns, [tagName, { patternIndex }]) => (
      R.update(patternIndex, { tagName, ...METADATAS[tagName] }, patterns)
    ),
      meta.patterns as PatternList,
      R.toPairs(meta.metadatas)
    )
      
    return;
  }
  
  const refs = R.pick(
    pathsArray.length === 0 ? R.keys(pathReferences.value) : pathsArray, 
    pathReferences.value
  );

  const patternKey = getPatternWithMostFrequence(refs) as GenTagKey;
  currentPattern.value =  R.map( tagName => ({ 
    tagName,
     ...METADATAS[tagName]}
    ), patternReferences.value[patternKey] || [])
}

watch(metadatasGenereted, watchReferenceMetadatas);
watch(pathSelections, watchPathsReferece, { deep : true});
</script>
