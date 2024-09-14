<template>
  <div v-if="metadatasGenereted?.length" class="flex gap-2 flex-col w-full overflow-y-hidden h-full">

    <div class="flex items-center font-medium justify-between text-x1 py-1.5">
      <div class="flex items-center gap-3">
        <div class="tracking-wider">Metadatas</div>
      </div>

      <div class="text-base-white-800 mr-3">
        {{ selectedReferenceMeta.length || metadatasGenereted.length }} dos arquivos referentes
      </div>
    </div>

    <div class="relative border-[1.5px] border-base-dark-300 rounded-lg py-2 px-1 overflow-y-hidden">
      <div class="z-50 h-full overflow-y-scroll custom-scrollbar">
        <TransitionGroup name="meta-fields" tag="div">
          <div v-for="( inputProps, index ) of createInputField(inputValues)" :key="inputProps.tag"
            v-show="checkFieldInputkAvailability(inputProps.value)" @click="focusInput(index)" class="mr-1">
            <div
              class="flex w-full group items-center gap-4 relative text-x1 rounded-md hover:bg-base-dark-400 cursor-pointer h-full pl-5 pr-2">
              <div
                :class="`absolute left-1 w-1 rounded-full h-4 ${chooseColorFieldStatusInput(inputProps.status)} shrink-0`" />

              <div class="flex gap-5 pl-2 items-center w-56">
                <component class="w-4 h-4 text-base-white-700" :is="inputProps.icon" />
                <div class="font-medium text-base-white-700 tracking-wide line-clamp-1">{{ inputProps.tag }}</div>
              </div>

              <div class="flex justify-between items-center w-full">
                <input :ref="el => inputRefs[index] = el as HTMLInputElement"
                  class="font-medium w-full h-8 bg-[rgb(0,0,0,0)] border-none outline-none"
                  :placeholder="inputProps.value === undefined ? 'Variados' : inputProps.value"
                  v-model.lazy.trim="getInputPropsComputed(inputProps.tag).value">

                <div class="flex gap-1 mx-1 h-full">
                  <div class=" text-base-white-700 group-hover:text-white"
                    v-for="icon of mappingStatusIcon(inputProps.status)">
                    <component class="w-[0.85rem] h-[0.85rem]" :is="icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <div class="">
      <div class="flex items-center h-10">
        <div
          class="flex items-center w-full h-full gap-4 text-x1 font-medium opacity-40 hover:opacity-90 cursor-pointer leading-[0]"
          @click="handleShowUpAllMetadatas" v-if="!isProcessingMetadatas">
          <component class="size-5 mx-2" :is="isOpenAllMetadatas ? ChevronUp : ChevronDown" />

          <p>Mostrar {{ isOpenAllMetadatas ? 'menos' : 'mais' }} metadatas</p>
        </div>

        <!-- loading -->
        <div class="flex relative items-center h-full w-full overflow-hidden" v-else>
          <div class="absolute h-[0.2rem] left-[50%] rounded-full w-40 bg-green-600 loading_process_metadatas" />
        </div>
      </div>

      <MetadatasControllers :currentMetadatas="metadatasForProcessing" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MetadatasControllers from './MetadatasControllers.vue';
import { Captions, Disc, Tag, Music2, Link2, LucideUsers, CalendarIcon, Edit, WandSparkles, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { computed, inject, provide, Ref, watch } from 'vue';
import { MetaResult } from 'src/types/metas-type';
import * as R from "ramda";
import { ref } from 'vue';
import { FieldTagStatus, FieldUniqueValue, IndexPathTags, InputDataProps, InputProps, SetNotificationFunction } from 'src/types/vue-types';
import { Tags } from 'src/types/tags';
import { useMedatas } from '@/stores/metadatas';
import { storeToRefs } from 'pinia';

const selectedReferenceMeta = inject<Ref<string[]>>('currentReferencesMeta')
const setNotification = inject<SetNotificationFunction>('setNotification')
const sourceMetadatas = ref<IndexPathTags<string>>({});
const isProcessingMetadatas = ref(false);
const isOpenAllMetadatas = ref(false);
const inputRefs = ref<(HTMLInputElement | undefined)[]>([])


const metadatas = useMedatas();
const  { currentMetadatas, sourceDirectory, metadatasGenereted } = storeToRefs(metadatas);
const { updateSource, updateByPathReference } = metadatas;
console.log("CARTA ", currentMetadatas)
const tagList: (keyof Tags)[] = [
  'album', 'artist', 'title', 'trackNumber',
  'genre', 'year', 'partOfSet', 'date',
  'publisher', 'copyright',
]
const inputValues = ref<InputProps>(
  createDefaultTags(tagList)
);

const { readMusicMetadatas } = window.api.nodeID3;

const metadatasForProcessing = R.ifElse(
  R.isEmpty,
  R.always(currentMetadatas),
  (selections: string[]) => R.pick(selections, currentMetadatas.value)
)(selectedReferenceMeta.value)


function createDefaultTags(tagList: (keyof Tags)[]) {
  return R.zipObj(
    tagList,
    R.repeat({ tagValue: '', status: ['DEFAULT'] as FieldTagStatus[] }, tagList.length)
  )
}

async function getAllOriginalMetadatas(allFields = false) {
  if (!isOpenAllMetadatas.value) return;

  if (R.isEmpty(sourceMetadatas.value)) {
    isProcessingMetadatas.value = true;
    const { fileSourceMetadatas, pathErrors } = await readMusicMetadatas(
      metadatasGenereted.value.map(meta => meta.path)
    )

    if (pathErrors.length) {
      setNotification({
        title: pathErrors.length + ' dos caminhos falharam ao ler metadatas',
        id: Date.now(),
        type: 'ERROR',
        context: 'Esses caminhos não estaram representados'
      })
    }

    for (const { metadatas, path } of fileSourceMetadatas) {
      for (const tag of tagList) {
        const tagValue = metadatas[tag];

        if (!currentMetadatas.value[path]?.[tag] && tagValue) {

          createDefaultInputFields(path, { tagValue, tag, status: 'DEFAULT' })
        }

        sourceMetadatas.value = R.assocPath([path, tag], tagValue, sourceMetadatas.value);

      }
    }

    isProcessingMetadatas.value = false;
    return;
  }

  for (const path in sourceMetadatas.value) {
    tagList.forEach((tag) => {
      if (sourceMetadatas.value[path]?.[tag] && !currentMetadatas.value[path]?.[tag]) {

        createDefaultInputFields(path, {
          tagValue: sourceMetadatas.value[path][tag],
          tag,
          status: 'DEFAULT'
        })

      }
    })

  }
}

function createDefaultInputFields(
  path: string,
  { tag, tagValue, status }: FieldUniqueValue & { tag: keyof Tags }
) {

  if (
    R.isNotEmpty(selectedReferenceMeta.value) &&
    !R.includes(path, selectedReferenceMeta.value)
  ) return;

  const { tagValue: inputValue, status: inputStatus } = inputValues.value[tag];


  if (
    inputValue === '' ||
    R.length(selectedReferenceMeta.value) === 1 ||
    status === 'EDITED' && R.isEmpty(selectedReferenceMeta.value) ||
    status === 'EDITED' && selectedReferenceMeta.value.length === metadatasGenereted.value.length
  ) {
    inputValues.value[tag] = { tagValue, status: [status] };
    return;
  }

  if (inputValue && inputValue !== tagValue) {
    inputValues.value[tag] = {
      tagValue: undefined,
      status: R.includes(status, inputStatus) ? inputStatus : R.append(status, inputStatus)
    };
  }

  if (!R.includes(status, inputStatus)) {
    inputValues.value[tag] = {
      tagValue: undefined,
      status: R.append(status, inputStatus)
    }
  }
}

function genereteTagsInitial(metaResultGenerated: Partial<MetaResult>[]) {
  for (const { path, metadatas } of metaResultGenerated) {
    if (metadatas) {
      R.forEachObjIndexed(({ value }, tag) => {
        const tagValues: FieldUniqueValue = {
          tagValue: value,
          status: 'GENERATED'
        }

        // set initial tag data for input values
        createDefaultInputFields(path, { ...tagValues, tag });

        return tagValues;
      }, metadatas)

    }
  }
}

function chooseIconByTag(tag: keyof Tags | string) {
  return ({
    "trackNumber": Music2,
    "title": Captions,
    "album": Disc,
    "feat": Link2,
    "artist": LucideUsers,
    "partOfSet": Disc,
    "year": CalendarIcon,
  }[tag] || Tag);
}

function chooseColorFieldStatusInput(status: FieldTagStatus[]) {
  return R.length(status) === 1 ? {
    "GENERATED": 'bg-green-400',
    "EDITED": 'bg-base-white-400',
    "DEFAULT": 'bg-none',
  }[status[0]]
    : 'bg-yellow-400'
}

function mappingStatusIcon(status: FieldTagStatus[]) {
  return status.map(type => ({
    "GENERATED": WandSparkles,
    'EDITED': Edit,
    'DEFAULT': Disc
  })[type]
  )
}

function createInputField(inputValues: InputProps): InputDataProps {
  return R.map(tag => {
    const input = inputValues[tag];
    return ({
      tag,
      icon: chooseIconByTag(tag),
      status: input.status,
      value: input.tagValue
    })
  }, tagList)
}

function watchSelectFilesChange() {
  inputValues.value = createDefaultTags(tagList);

  R.forEachObjIndexed((metadatas, path) => {
    R.forEachObjIndexed(({ status, tagValue }, tag) => {
      createDefaultInputFields(String(path), { status, tagValue, tag })
    }, metadatas)
  }, currentMetadatas.value);

  getAllOriginalMetadatas()
}

function watchChangeInput(tag: keyof Tags) {
  console.log("cheguei", 3)
  return (inputChanged: string) => {
    for (const path in currentMetadatas.value) {
      if (
        R.isNotEmpty(selectedReferenceMeta.value) &&
        R.includes(path, selectedReferenceMeta.value) ||
        R.isEmpty(selectedReferenceMeta.value)
      ) {
        const updatedValue: FieldUniqueValue = {
          status: 'EDITED', tagValue: inputChanged
        }

        updateByPathReference([path, tag], updatedValue)
        createDefaultInputFields(path, { ...updatedValue, tag })
      }
    }
  }
}

function getInputPropsComputed(tag: keyof Tags) {
  return computed({
    get() {
      return inputValues.value[tag].tagValue
    },
    set: watchChangeInput(tag)
  })
}

function watchOriginalMetadatas(isAllMetadatas: boolean) {
  watchSelectFilesChange()
}

function checkFieldInputkAvailability(fieldValue: string): boolean {
  return fieldValue !== '' || (isOpenAllMetadatas.value && !isProcessingMetadatas.value)
}

watch(metadatasGenereted, genereteTagsInitial, { once: true });
watch(selectedReferenceMeta, watchSelectFilesChange, { deep: true });
watch(isOpenAllMetadatas, watchOriginalMetadatas);

function handleShowUpAllMetadatas() {
  isOpenAllMetadatas.value = !isOpenAllMetadatas.value
}

function focusInput(index: number) {
  if (inputRefs.value[index]) {
    inputRefs.value[index]?.focus();
  }
}

provide('setIsProcessing', isProcessingMetadatas);
provide('current', () => {
  return R.ifElse(
    R.isEmpty,
    R.always(currentMetadatas.value.value),
    (selections: string[]) => R.pick(selections, currentMetadatas.value)
  )(selectedReferenceMeta.value)
})
</script>
