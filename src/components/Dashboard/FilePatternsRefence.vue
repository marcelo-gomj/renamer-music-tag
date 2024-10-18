<template>
  <div class="w-full">
    <div class="h-12">
      <div 
        v-if="pathSelections.size !== 1"
        class="flex gap-8 items-center"
      >
        <div class="font-medium text-x1 w-48">Referência padrão {{ currentPattern?.patternKey ? findIndexPattern(currentPattern.patternKey) : 'Variado' }}</div>
  
        <div class="relative select-none">
          <div 
            class="flex group items-center gap-4 text-x1 h-12 text-base-white-500 font-medium hover:to-base-white-700 cursor-pointer"
            @click="handleTogglePatternList"
          >
            <div class="leading-[0]">Mostrar outros padrões</div>
            <chevron-down :class="`size-5 ${ isOpenPatternList ? 'rotate-180' : ''}`" />
          </div>
    
          <pattern-options 
            :current-pattern="currentPattern"
            :handle-pattern-list-leave="handlePatternListLeave"
            :is-open-pattern-list="isOpenPatternList"
            :pattern-references="patternReferences"
            :handle-select-pattern="handleSelectPattern"
          />
        </div>
      </div>

      <div
        v-else
        class="flex items-center h-12 gap-8 text-x1 font-medium "
      >
        <div>Referência ao arquivo:</div>
        <div 
          class="text-base-white-700"
        >{{ R.last([...pathSelections.keys()][0]?.split(/[\\|/]/)) }}</div>
      </div>
    </div>

    <tag-context 
      :active-context-options="activeContextOptions"
      :current-pattern="currentPattern"
      :swap-context-active="swapContextActive"
      :handle-leave-context-options="handleLeaveContextOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { 
  Music2, Captions, Disc, ChevronDown,
  CalendarIcon, User, Tag, TrashIcon, 
  Undo2, Users, Grid2X2 
} from 'lucide-vue-next';
import * as R from "ramda";
import { useMedatas } from '@/stores/metadatas';
import { storeToRefs } from 'pinia';
import { 
  CurrentPatternReference,
  PatternList, ReducePatternsObject, 
  ReferencePathsPattern, ReferencePatterns 
} from '@/types/vue-types'
import { ref, watch } from 'vue';
import { GenMetadatasResult, GenTagKey } from '@/types/metas-type';
import { usePathSelection } from '@/stores/path-selections';
import TagContext from './TagContext.vue';
import PatternOptions from './PatternOptions.vue';
import { METADATAS } from '../constants/metadatas';

const { metadatasGenereted } = storeToRefs(useMedatas());
const usePaths = usePathSelection();
const { pathSelections } = storeToRefs(usePaths);
const { selectPath } = usePaths;

const pathReferences = ref<ReferencePathsPattern>({})
const patternReferences = ref<ReferencePatterns>({})
const currentPattern = ref<CurrentPatternReference>();
const swapContextActive = ref<number | null>(null);
const isOpenPatternList = ref(false);

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
  watchPathsReferece(pathSelections.value)
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

function handleSelectPattern(patternKey: string | undefined){
  pathSelections.value.clear()

  if(!patternKey){
    watchPathsReferece(pathSelections.value)
    return;
  }

  currentPattern.value = mappingTagPattern(patternReferences.value, patternKey);
  const paths = R.filter(([_, key]) => key === patternKey,
    R.toPairs(pathReferences.value)
  )

  paths.forEach(([path]) => {
    selectPath(path)
  })
}

function referenceByUniquePath(pathsArray: string[]){
  const meta = R.find(meta => meta.path === pathsArray[0], metadatasGenereted.value);

  const patternKeys = R.reduce(
    (patterns, [tag, { patternIndex }]) => R.update(patternIndex, tag, patterns),
    meta.patterns,
    R.toPairs(meta.metadatas)
  )

  currentPattern.value =  mappingTagPattern(patternKeys);
}

const reorderArray = (originalArray: string[], tagsOrder: string[]) => {
  const isPatternIndex = R.includes('pattern');

  const preservedPatternIndexes = R.addIndex<string, { item: string, index: number } | null>(
    R.map
  )((item, index) => 
    isPatternIndex(item) ? { index, item } : null, 
    originalArray
  ).filter((x): x is { item: string, index: number} => x !== null);

  const orderedItems : string[] = R.pipe(
    R.filter<string>(R.complement(isPatternIndex)),
    R.sort((itemA, itemB) => R.indexOf(itemA, tagsOrder) - R.indexOf(itemB, tagsOrder)) 
  )(originalArray);

  const resultArray : string[] = R.addIndex(
    R.reduce
  )((acc : string[], item, index: number) => {
    const patternItem  = R.find( pattern => pattern.index === index, preservedPatternIndexes);
    return patternItem ? R.append(patternItem.item, acc) : R.append(orderedItems.shift(), acc);
  }, [], originalArray);

  return resultArray;
};

function watchPathsReferece(paths: Set<string>) {
  swapContextActive.value = null;
  const pathsArray = paths.size === 0 ? metadatasGenereted.value.map(item => item.path) :  [...paths.keys()];

  if (paths.size === 1) {
    referenceByUniquePath(pathsArray);
    return;
  }
  
  const uniquePatterns = R.into([], R.compose(
      R.map((path: string) => pathReferences.value[path]),
      R.uniq<string>
    ),
    pathsArray 
  )
  const isUniquePattern = R.length(uniquePatterns) === 1;

  if(isUniquePattern){
    currentPattern.value = mappingTagPattern(patternReferences.value, uniquePatterns[0]);
    return;
  }

  const patternsArray = R.map( patternKey => patternReferences.value[patternKey], uniquePatterns); 
  const patterns = R.reduce(
    R.union, 
    [], 
    patternsArray
  ) as string[]

  currentPattern.value = mappingTagPattern(
    reorderArray(patterns, [
      'trackNumber', 'title', 'artist', 'album', 
      'year', 'genre', 'partOfSet', 'date',
      'publisher', 'copyright', 'performerInfo'
    ])
  )
}

function findIndexPattern(patternKey: string){
  return R.findIndex( data => data === patternKey, R.keys(patternReferences.value)) + 1
}

// genarete initial patterns
watch(metadatasGenereted, watchReferenceMetadatas);
watch(pathSelections, watchPathsReferece, { deep: true });
</script>
