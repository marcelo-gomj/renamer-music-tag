<template>
  <div class="w-full">
    <div class="h-12">
      <div v-if="pathSelections.size !== 1" class="flex gap-8 items-center">
        <div class="font-medium text-x1 w-48">Referência padrão {{ currentPattern?.patternKey === 'all' ? 'Variado' :
          findIndexPattern(currentPattern.patternKey) }}</div>

        <div class="relative select-none">
          <div
            class="flex group items-center gap-4 text-x1 h-12 text-base-white-500 font-medium hover:to-base-white-700 cursor-pointer"
            @click="handleTogglePatternList">
            <div class="leading-[0]">Mostrar outros padrões</div>
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

      <div v-else class="flex items-center h-12 gap-8 text-x1 font-medium ">
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
import { provide, reactive, ref, watch } from 'vue';
import { GenMetadatas, GenMetadatasResult, GenTagKey } from '@/types/metas-type';
import { usePathSelection } from '@/stores/path-selections';
import TagContext from './TagContext.vue';
import PatternOptions from './PatternOptions.vue';
import { Tags } from '@/types/tags';
import { usePatterns } from '@/stores/patterns';

type PatternsGroupMatch = R.ValueOfUnion<PathIndexReferences>[][];

const usePath = usePathSelection();

const { 
  currentPattern, 
  pathReferences, 
  patternReferences,
  changePatternGlobal, watchMetadatasPattern
} = usePatterns();
const { metadatasGenereted } = storeToRefs(useMedatas());
const { pathSelections } = storeToRefs(usePath);

const isOpenPatternList = ref(false);

const { getAllPaths, selectPath } = usePath;




// Cria os padrões e indexa nos caminhos correspondentes 
const indexPathPatternReferences = (metadatasGenereted: GenMetadatasResult[]) => {
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

  R.forEachObjIndexed(({ patternKey: key }, path) => {
    if (key === patternKey) {
      selectPath(String(path));
    }
  }, pathReferences)

}

const referenceByUniquePath = (path: string) => {
  const { metadatas, patterns } = R.find(
    meta => meta.path === path, 
    metadatasGenereted.value
  );

  const indexedTagRepeats = R.reduce(
    (tagIndexed, [tag, tagRepeatsIndex]) => {
    for (const { patternIndex } of tagRepeatsIndex) {
      tagIndexed[patternIndex] = tag;
    }

    return tagIndexed;
  },
    {} as Record<number, GenTagKey>,
    R.toPairs(pathReferences[path].repeats)
  )

  const deepReference = R.reduce(
    (patterns, [tag, { patternIndex }]) => (
    R.includes('pattern-', tag) ? patterns :
    R.update(patternIndex, indexedTagRepeats[patternIndex] || tag, patterns)
  ),
    patterns,
    R.toPairs(metadatas)
  )

  changePatternGlobal({ 
    patternKey: pathReferences[path].patternKey, 
    patternProps: deepReference
  })

}


const reorderMetaTags = (groups: GenTagKey[][]) => {
  const patternProps = R.filter((tag) => (
    R.reduce((hasTag, group) => (
      R.includes(tag, group) ? R.reduced(true) : hasTag
    ), false, groups)
  ), [
    'trackNumber', 'title', 'artist', 'album',
    'year', 'genre', 'partOfSet', 'date',
    'publisher', 'copyright', 'performerInfo'
  ] as GenTagKey[])

  return { patternProps, patternKey: 'all' }
}

const matchUniquePattern = (
  [groups]: PatternsGroupMatch
) => {
  const { patternKey } = R.head(groups);

  const repeatPatterns = R.reduce((
    repeatsAcc, 
    { repeats }
  ) => {
      R.forEachObjIndexed((repeat, tag) => {
        if (repeatsAcc[tag] === undefined || repeat.length > repeatsAcc[tag]) {
          repeatsAcc[tag] = repeat.length;
        }

        return repeatsAcc
      }, repeats);

      return repeatsAcc
    },
    {} as { [tag in keyof Tags]: number },
    groups
  )

  const patternProps = R.map(tag => (
    repeatPatterns[tag as keyof Tags] ? 
    R.repeat(tag, repeatPatterns[tag as keyof Tags]) : 
    tag
  ), patternReferences[patternKey])

  return { patternProps, patternKey }
}

const listMultiPatterns = R.pipe(
  R.map((group: PatternsGroupMatch[0]) => (
    patternReferences[group[0].patternKey]
  )),
  reorderMetaTags
)

const findPatternsByPath = R.pipe(
  R.map((path: string) => pathReferences[path]),
  R.collectBy(R.prop('patternKey')),
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