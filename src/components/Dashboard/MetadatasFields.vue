<template>
  <div v-if="metadatasGenereted?.length" class="flex gap-2 flex-col w-full overflow-y-hidden h-full">

    <div class="flex items-center font-medium justify-between text-x1 py-1.5">
      <div class="flex items-center gap-3">
        <div class="tracking-wider">Metadatas</div>
      </div>

      <div class="text-base-white-800 mr-3">
        {{ pathSelections.size || metadatasGenereted.length }} dos arquivos referentes
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
                  v-model.lazy.trim="getInputPropsComputed(inputProps.tag).value"
                />
 
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

      <MetadatasControllers />
    </div>
  </div>
</template>

<script setup lang="ts">
import MetadatasControllers from './MetadatasControllers.vue';
import { computed, inject, ref, provide, Ref, watch } from 'vue';
import * as R from "ramda";
import { 
  Captions, Disc, Tag, Music2,
  Link2, LucideUsers, CalendarIcon, Edit,
  WandSparkles, ChevronDown, ChevronUp 
} from 'lucide-vue-next';

import { CurrentUserMetadatas, GenMetadatasResult } from 'src/types/metas-type';
import { 
  FieldTagStatus, 
  FieldUniqueValue, 
  FieldValue, 
  IndexPathTags, 
  InputDataProps, 
  InputProps, 
} from 'src/types/vue-types';
import { Tags } from 'src/types/tags';
import { useMedatas } from '@/stores/metadatas';
import { storeToRefs } from 'pinia';
import { useNotification } from '@/stores/notifications';
import { usePathSelection } from '@/stores/path-selections';

const sourceMetadatas = ref<IndexPathTags<string>>({});
const isProcessingMetadatas = ref(false);
const isOpenAllMetadatas = ref(false);
const inputRefs = ref<(HTMLInputElement | undefined)[]>([])


const metadatas = useMedatas();
const usePath = usePathSelection();
const { pathSelections } = storeToRefs(usePath);
const { isPathSelected } = usePath;
const  { currentMetadatas, metadatasGenereted } = storeToRefs(metadatas);
const notifications = useNotification();
const { updateSource, updateByPathReference } = metadatas;

const tagList: (keyof Tags)[] = [
  'album', 'artist', 'title', 'trackNumber',
  'genre', 'year', 'partOfSet', 'date',
  'publisher', 'copyright', 'performerInfo'
]

const inputValues = ref<InputProps>(
  createDefaultTags(tagList)
);

const { readMusicMetadatas } = window.api.nodeID3;

const metadatasForProcessing = R.ifElse(
  R.isEmpty,
  R.always(currentMetadatas),
  (selections: string[]) => R.pick(selections, currentMetadatas.value)
)([...pathSelections.value.keys()])


function createDefaultTags(tagList: (keyof Tags)[]) {
  return new Map(R.map( tag => [
    tag, 
    { tagValue: '', status : ['DEFAULT'] } as FieldValue
  ], tagList))
}

async function getAllOriginalMetadatas(allFields = false) {
  if (!isOpenAllMetadatas.value) return;

  if (R.isEmpty(sourceMetadatas.value)) {
    isProcessingMetadatas.value = true;
    const { fileSourceMetadatas, pathErrors } = await readMusicMetadatas(
      metadatasGenereted.value.map(meta => meta.path)
    )

    if (pathErrors.length) {
      notifications.notify({
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

          createDefaultInputFields(
            path, 
            { tagValue, tag, status: 'DEFAULT' }
          )
        }

        sourceMetadatas.value = R.assocPath(
          [path, tag], 
          tagValue, 
          sourceMetadatas.value
        );

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
    pathSelections.value.size &&
    !isPathSelected(path)
  ) return;

  const { tagValue: inputValue, status: inputStatus } = inputValues.value.get(tag);


  if (
    inputValue === '' ||
    pathSelections.value.size === 1 ||
    status === 'EDITED' && pathSelections.value.size ||
    status === 'EDITED' && pathSelections.value.size === metadatasGenereted.value.length
  ) {
    inputValues.value.set(tag, { tagValue, status: [status] });
    return;
  }

  if (inputValue && inputValue !== tagValue) {
    inputValues.value.set(tag, {
      tagValue: undefined,
      status: R.includes(status, inputStatus) ? inputStatus : R.append(status, inputStatus)
    })
  }

  if (!R.includes(status, inputStatus)) {
    inputValues.value.set(tag, {
      tagValue: undefined,
      status: R.append(status, inputStatus)
    })
  }
}

// function genereteTagsInitial(currentMetadatas: CurrentUserMetadatas[]) {
//   R.forEachObjIndexed((metadatas, path) => {
//     R.forEachObjIndexed((meta, tag) => {
//       createDefaultInputFields(
//         String(path), 
//         {status: , tagValue, tag }
//       );
//     }, metadatas)
//   }, currentMetadatas)
// }

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
    const input = inputValues.get(tag);
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
    R.forEachObjIndexed(({ tagValue, status }, tag) => {
      createDefaultInputFields(String(path), { status, tagValue, tag })
    }, metadatas)
  }, currentMetadatas.value);

  getAllOriginalMetadatas()
}

function watchChangeInput(tag: keyof Tags) {
  return (inputChanged: string) => {
    for (const path in currentMetadatas.value) {
      if (
        pathSelections.value.size &&
        isPathSelected(path) ||
        pathSelections.value.size === 0
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
      return inputValues.value.get(tag).tagValue
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

// watch(metadatasGenereted, watchSelectFilesChange);
watch([pathSelections, metadatasGenereted], watchSelectFilesChange, { deep: true });
watch(isOpenAllMetadatas, watchOriginalMetadatas);

function handleShowUpAllMetadatas() {
  isOpenAllMetadatas.value = !isOpenAllMetadatas.value
}

function focusInput(index: number) {
  if (inputRefs.value[index]) {
    inputRefs.value[index]?.focus();
  }
}

</script>
