<template>
  <div class="w-full">
    <div class="flex items-center gap-6 h-12">
      <div class="flex gap-10 items-center">
        <div class="relative select-none">
          <div
            class="flex group items-center gap-4 text-x1 h-12 text-base-white-500 font-medium hover:to-base-white-700 cursor-pointer"
            @click="handleTogglePatternList"
          >
            <div class="leading-[0]">{{currentPattern.patternKey  === 'all' ? 'Todos os padrões' : "Padrão " + ( currentPattern?.patternKey || "Indefinido").toUpperCase()}}</div>
            <chevron-down :class="`size-5 ${isOpenPatternList ? 'rotate-180' : ''}`" />
          </div>

          <pattern-options 
            :current-pattern="currentPattern" 
            :handle-pattern-list-leave="handlePatternListLeave"
            :is-open-pattern-list="isOpenPatternList" 
            :pattern-references="patternReferences"
            :handle-select-pattern="handleSelectPattern" />
        </div>
      </div>

      <div v-if="pathSelections.size === 1" class="flex items-center h-12 gap-8 text-x1 font-medium ">
        <div>Referência ao arquivo:</div>
        <div class="text-base-white-700">{{ R.last([...pathSelections.keys()][0]?.split(/[\\|/]/)) }}</div>
      </div>
    </div>

    <tag-context />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import * as R from "ramda";
import { useMedatas } from '@/stores/metadatas';
import { storeToRefs } from 'pinia';
import {
  PathIndexReferences,
  PatternReferences
} from '@/types/vue/references'
import { provide, ref, watch } from 'vue';
import { GenMetadatasResult, GenTagKey } from '@/types/metas-type';
import { usePathSelection } from '@/stores/path-selections';
import TagContext from './TagContext.vue';
import PatternOptions from './PatternOptions.vue';
import { usePatterns } from '@/stores/patterns';
import { decodeMultiTags } from '@/utils/indexByPath';
import { reOrderTagList } from '@/utils/filter';

type PatternsGroupMatch = R.ValueOfUnion<PathIndexReferences>[][];

const usePath = usePathSelection();

const { 
  currentPattern, 
  pathReferences, 
  patternReferences,
  changePatternGlobal, 
  watchMetadatasPattern
} = usePatterns();
const { metadatasGenereted, currentMetadatas } = storeToRefs(useMedatas());
const { pathSelections } = storeToRefs(usePath);

const isOpenPatternList = ref(false);

const { getAllPaths, selectPath } = usePath;

const indexPathPatternReferences = (
  metadatasGenereted: GenMetadatasResult[]
) => {
  metadatasGenereted.forEach(watchMetadatasPattern);
  watchPathChanges();
}

function handleTogglePatternList() {
  isOpenPatternList.value = !isOpenPatternList.value;
}

function handlePatternListLeave() {
  isOpenPatternList.value = false;
}

function handleSelectPattern(patternKey: string) {
  if (patternKey === currentPattern.patternKey) return;

  pathSelections.value.clear()

  R.forEachObjIndexed(( key, path) => {
    if (key === patternKey) {
      selectPath(String(path));
    }
  }, pathReferences)

  isOpenPatternList.value = false;

}

const referenceByUniquePath = (path: string) => {
  const { patterns } = R.find(
    meta => meta.path === path, 
    metadatasGenereted.value
  );

  const patternByPath = decodeMultiTags(
    currentMetadatas.value[path],
    patterns 
  )

  changePatternGlobal({ 
    patternKey: pathReferences[path], 
    patternProps: patternByPath
  })
}

const reorderMetaTags = (groups: GenTagKey[][]) => {
  const patternProps = reOrderTagList(groups);

  return { patternProps, patternKey: 'all' }
}

const matchUniquePattern = (
  [groups]: PatternsGroupMatch
) => {
  const patternKey = R.head(groups);

  return {
    patternProps : patternReferences[patternKey], 
    patternKey 
  }
}

const listMultiPatterns = R.pipe(
  R.map((group: PatternsGroupMatch[0]) => (
    patternReferences[group[0]]
  )),
  reorderMetaTags
)

const findPatternsByPath = R.pipe(
  R.map((path: string) => pathReferences[path]),
  R.collectBy(R.identity),
  R.ifElse(
    groups => groups.length === 1,
    matchUniquePattern,
    listMultiPatterns
  )
)

const watchPathChanges = () => {
  const pathsArray = getAllPaths();

  if (pathsArray.length === 1) {
    referenceByUniquePath(pathsArray[0]);
    return;
  }

  const { patternProps, patternKey } = findPatternsByPath(pathsArray);

  changePatternGlobal({
    patternKey,
    patternProps
  })
}

const findIndexPattern = (patternKey: string) => (
  R.findIndex(
    data => data === patternKey, 
    R.keys(patternReferences) 
  ) + 1
)

// genarete initial patterns
provide("tes", watchPathChanges)
watch(metadatasGenereted, indexPathPatternReferences, { deep: true });
watch(pathSelections, watchPathChanges, { deep: true });

</script>