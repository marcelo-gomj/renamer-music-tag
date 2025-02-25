<script setup lang="ts">
import { Grid2X2, TrashIcon, Undo2 } from 'lucide-vue-next';
import { ALL_METADATAS, METADATAS } from '../constants/metadatas';
import { useMedatas } from "@/stores/metadatas";
import { storeToRefs } from 'pinia';
import { ChangeTagProps, PatternInterfaces, PatternListProps } from '@/types/vue/references';
import { usePathSelection } from '@/stores/path-selections';
import * as R from "ramda";
import { inject, ref, watch } from 'vue';
import { GenTagKey } from '@/types/metas-type';
import { Tags } from '@/types/tags';
import { usePatterns } from '@/stores/patterns';

const { pathSelections } = storeToRefs(usePathSelection());
const swapContextActive = ref<number | null>(null);
const showTagGroup = ref<number | null>(null);
const tagComponentProps = ref<PatternListProps>([])

const { 
  watchMetadatasPattern, 
  currentPattern,
  cleanPatternUnless
} = usePatterns();

const tes = inject<() => void>('tes');

const metadatas = useMedatas();
const { changeTagsReferences } = metadatas
const { metadatasGenereted, currentMetadatas } = storeToRefs(metadatas);

const getPropTag = (
  tagName: GenTagKey | string
) => (
  ALL_METADATAS[tagName as GenTagKey] ||
  { label: tagName, icon: undefined } 
)

const createTagProps = (
  tagName: (string | GenTagKey),
  labels: ReturnType<typeof getPropTag>,
  isMultiTag?: boolean
) => ({
  tagName,
  isTag: !!labels?.icon,
  isMultiTag,
  icon: labels?.icon,
  label: labels?.label
}) as PatternInterfaces;

const createTagsInterface = (
  patterns: (GenTagKey[] | GenTagKey | string)[] 
) : PatternListProps => (
  R.flatten(patterns.map((tagName, index) => {
    if( R.is(String, tagName) ){
      return createTagProps(tagName, getPropTag(tagName)) 
    }

    if(showTagGroup.value === index){
      return R.map(subTag => createTagProps(subTag, getPropTag(subTag)), tagName)
    }

    const defaultMultiTag = R.head(tagName);
    return createTagProps(defaultMultiTag, getPropTag(defaultMultiTag));
  })
))


const ACTIONS_CONTEXT = [
  { key: 'reset', label: 'Resetar', actionIcon: Undo2, action: () => { } },
  { key: 'delete', label: 'Apagar', actionIcon: TrashIcon, action: () => { } },
]

const handleChangeTag = (
  changeTag: ChangeTagProps
) => {
  const paths = [...pathSelections.value.keys()];

  paths.forEach((path, index) => {
    changeTagsReferences(path, changeTag);
    watchMetadatasPattern({ 
      metadatas: currentMetadatas.value[path], 
      path
    }, index);
    cleanPatternUnless();
  });

  tes();
}

function toggleContextOptions(tagIndex: number | null) {
  swapContextActive.value = tagIndex;
}

function checkTagPattern(pattern: string){
  return !!METADATAS[pattern as keyof Tags]
}

function listContext0ptions(
  patternIndex: number, 
  pattern: string 
) : [string, R.ValueOfUnion<typeof ALL_METADATAS> & { isNext: boolean }][] {
  const isTagValid = checkTagPattern(pattern);
  const currentPatternFlatten = R.flatten(currentPattern.patternProps); 
  const [left, right] = R.splitAt(patternIndex + 1, currentPatternFlatten);

  const contextParts = R.filter(R.isNotNil, [
    R.findLast(checkTagPattern, R.init(left)),
    R.find(checkTagPattern, right)
  ])
  const tagInuques = R.without([pattern], R.uniq(contextParts));

  if(
    contextParts.length === 2 && 
    tagInuques.length === 0
  ) return (
    isTagValid ? [] : 
    [[
      R.head(tagInuques), 
      {
        ...ALL_METADATAS[R.head(tagInuques) as GenTagKey], 
        isNext: true 
      }
    ]]
  )

  const excludedCurrentPatterns = R.without(
    currentPatternFlatten, 
    R.keys(ALL_METADATAS)
  );

  return [
    ...tagInuques, 
    ...excludedCurrentPatterns
  ].map((tag) => [
    tag, 
    {
      ...ALL_METADATAS[tag as GenTagKey],
      isNext: tagInuques.includes(tag)
    }
  ])
}

watch([pathSelections, currentPattern], () => toggleContextOptions(null))
watch(currentPattern, () => {
  tagComponentProps.value = createTagsInterface(currentPattern?.patternProps);
})
</script>

<template>
  <div class="flex flex-wrap font-medium gap-x-2 gap-y-4 pr-4 w-full mt-2 min-h-[2.2rem]">
    <div 
      v-if="metadatasGenereted.length"
      v-for="(pattern, index) in tagComponentProps"
      @click="() => toggleContextOptions(index)" 
      @mouseleave="() => toggleContextOptions(null)"
      :key="(pattern.tagName + index)"
      :class="`flex shrink-0 relative tracking-wide items-center select-none group text-x1 gap-4 cursor-pointer ${pattern.isTag ? `${index === swapContextActive ? 'bg-base-dark-700' : ''} pl-5 pr-6 rounded-full bg-base-dark-400 shadow-[2px_2px_20px] shadow-base-dark-200` : `${index === swapContextActive ? 'border-green-500' : ''} border-2 rounded-full border-[transparent] cursor-pointer px-2`}`"
    >
      <component :is="pattern.icon" class="w-[1rem] h-[1rem]" />
      <div :class="`leading-[1] ${pattern.isTag ? '' : 'font-bold'}`">{{ pattern.label }}</div>

      <div class="absolute top-full left-0 z-[999]">
        <div class="rounded-xl mt-2 bg-base-dark-250  p-2" v-if="index === swapContextActive">
          <div class="flex gap-6 px-4 pt-1 pb-3 mb-1 border-base-dark-600 border-b-2">
            <div 
              v-for="{ actionIcon, key, label, action } in ACTIONS_CONTEXT" 
              :key="key" 
              :title="label"
              @click="action"
            >
              <component 
                class="size-5" 
                :is="actionIcon" 
              />
            </div>
          </div>

          <div 
            v-for="[tag, { label: sublabel, icon, isNext }] in listContext0ptions(index, pattern.tagName)" 
            v-show="sublabel !== pattern.label"
            :key="tag" 
            class="flex items-center gap-6 w-52 px-5 py-2 rounded-lg hover:bg-base-dark-700"
            @click="() => handleChangeTag({
              currentTag: pattern.tagName,
              updateNewTag: tag,
              codePattern: currentPattern.patternKey,
              currentIndexTag: index,
              isPathUnique : pathSelections.size === 1,
              isNextToTag: isNext
            })"
          >
            <component 
              :is="icon" 
              class="size-4" 
            />
            <div>{{ sublabel }}</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
