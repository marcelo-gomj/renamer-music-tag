<template>
  <div v-if="metasGenerated?.length" class="flex flex-col w-[50%] overflow-y-hidden h-full">
    <div class="flex font-medium justify-between text-x1 mt-2.5 my-4">
      <div class="flex items-center gap-3">
        <div class="tracking-wider">Metadatas</div>
      </div>

      <div class="text-base-white-800">
        {{ selectedReferenceMeta.length || metasGenerated.length }} dos arquivos referentes
      </div>
    </div>

    <div class="overflow-y-scroll">
      <div v-for="inputProps of createInputField(inputValues)"
        :key="inputProps.tag"
        class="group relative text-x1  pl-6 pr-2 my-1 rounded-md hover:bg-base-dark-400 cursor-pointer">
        <div class="flex items-center gap-4" v-if="isOpenAllMetadatas || inputProps.value !== ''">

          <div :class="`absolute left-1 w-1 rounded-full h-4 ${chooseColorFieldStatusInput(inputProps.status)} shrink-0`" 
          />

          <div class="flex gap-5 items-center w-40">
            <component class="w-4 h-4 text-base-white-700" :is="inputProps.icon" />
            <div class="font-medium text-base-white-700 tracking-wide line-clamp-1">{{ inputProps.tag }}</div>
          </div>

          <div class="flex justify-between items-center w-full">
            <input class="font-medium w-full h-8 bg-[rgb(0,0,0,0)] border-none outline-none"
              :placeholder="inputProps.value === undefined ? 'Variados' : inputProps.value"
              v-model.lazy.trim="getInputPropsComputed(inputProps.tag).value"
            >

            <div
              class="flex gap-1 mx-1 h-full"
            >
              <div class=" text-base-white-700 group-hover:text-white"
                v-for="icon of mappingStatusIcon(inputProps.status)"
              >
                <component class="w-[0.85rem] h-[0.85rem]" :is="icon" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="flex gap-4 pt-3 text-x1 font-medium opacity-40 hover:opacity-90 cursor-pointer" @click="handleShowUpAllMetadatas">
      <component :is="isOpenAllMetadatas ? ChevronUp : ChevronDown" />
      <p>Mostrar {{ isOpenAllMetadatas ? 'menos' : 'mais' }} metadatas</p>
    </div>

    <MetadatasControllers />
  </div>
</template>

<script setup lang="ts">
import MetadatasControllers from './MetadatasControllers.vue';
import { Captions, Disc, Tag, Music2, Link2, LucideUsers, CalendarIcon, Edit, WandSparkles, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { computed, inject, Ref, watch } from 'vue';
import { MetaResult, CurrentMetaSave } from 'src/types/metas-type';
import * as R from "ramda";
import { ref } from 'vue';
import { FieldTagStatus, FieldUniqueValue, FieldValue, IndexPathTags, InputDataProps, InputProps } from 'src/types/vue-types';
import { Tags } from 'src/types/tags';

const metasGenerated = inject<Ref<MetaResult[]>>("referenceFiles");
const selectedReferenceMeta = inject<Ref<string[]>>('currentReferencesMeta')
const sourceMetadatas = ref<IndexPathTags<string>>({});
const currentMetadatas = ref<CurrentMetaSave>({})
const isOpenAllMetadatas = ref(false);
const tagList: (keyof Tags)[] = [
  'album', 'artist', 'title', 'trackNumber',
  'genre', 'year', 'partOfSet', 'date',
  'publisher', 'copyright',
]
const inputValues = ref<InputProps>(
  createDefaultTags(tagList)
);

const { readMusicMetadatas } = window.api.nodeID3;

function createDefaultTags(tagList: (keyof Tags)[]) {
  return R.zipObj(
    tagList,
    R.repeat({ tagValue: '', status: ['DEFAULT'] as FieldTagStatus[] }, tagList.length)
  )
}

async function getAllOriginalMetadatas(allFields = false) {
  if (!isOpenAllMetadatas.value) return;

  if (R.isEmpty(sourceMetadatas.value)) {
    const { fileSourceMetadatas } = await readMusicMetadatas(
      metasGenerated.value.map(meta => meta.path)
    )

    for (const { metadatas, path } of fileSourceMetadatas) {
      for (const tag of tagList) {
        const tagValue = metadatas[tag];

        if(!currentMetadatas.value[path]?.[tag]){
          createDefaultInputFields( path, { tagValue, tag, status : 'DEFAULT' })
        }

        sourceMetadatas.value = R.assocPath([path, tag], tagValue, sourceMetadatas.value);

      }
    }

    return;
  }

  for (const path in sourceMetadatas.value) {
    tagList.forEach((tag) => {
      if (sourceMetadatas.value[path]?.[tag]) {
        if(!currentMetadatas.value[path]?.[tag]){

        createDefaultInputFields(path, {
          tagValue: sourceMetadatas.value[path][tag],
          tag, 
          status: 'DEFAULT'
        })
      }
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

  const { tagValue: inputValue, status : inputStatus } = inputValues.value[tag];


  if (
    inputValue === '' || 
    R.length(selectedReferenceMeta.value) === 1 ||
    status === 'EDITED' && R.isEmpty(selectedReferenceMeta.value) ||
    status === 'EDITED' && selectedReferenceMeta.value.length === metasGenerated.value.length
  ){
    inputValues.value[tag] = { tagValue, status : [status] };
    return;
  }

  if (inputValue && inputValue !== tagValue){
    inputValues.value[tag] = {
      tagValue: undefined,
      status: R.includes(status, inputStatus) ? inputStatus : R.append(status, inputStatus)
    };
  }

  if(!R.includes(status, inputStatus)){
    inputValues.value[tag] = {
      tagValue: undefined,
      status: R.append(status, inputStatus)
    }
  }
}

function genereteTagsInitial(metaResultGenerated: Partial<MetaResult>[]) {
  for (const { path, metadatas } of metaResultGenerated) {
    if (metadatas) {
      currentMetadatas.value[path] = R.mapObjIndexed(({ value }, tag) => {
        const tagValues: FieldUniqueValue = {
          tagValue: value,
          status: 'GENERATED'
        }

        // set initial tag data for input values
        createDefaultInputFields(path, { ...tagValues, tag });

        return tagValues;
      }, metadatas);
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

function chooseColorFieldStatusInput(status: FieldTagStatus[]){
  return R.length(status) === 1 ? {
    "GENERATED" : 'bg-green-400',
    "EDITED" : 'bg-base-white-400',
    "DEFAULT" : 'bg-none',
    }[status[0]]
  : 'bg-yellow-400'
}

function mappingStatusIcon(status: FieldTagStatus[]){
  return status.map( type => ({ 
      "GENERATED": WandSparkles,
      'EDITED' : Edit,
      'DEFAULT' : Disc
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
  return (inputChanged: string) => {
    for (const path in currentMetadatas.value) {
      if (
        R.isNotEmpty(selectedReferenceMeta.value) &&
        R.includes(path, selectedReferenceMeta.value) ||
        R.isEmpty(selectedReferenceMeta.value)
      ) {
        const updatedValue : FieldUniqueValue = { 
          status: 'EDITED', tagValue: inputChanged
        }

        currentMetadatas.value = R.assocPath(
          [path, tag], 
          updatedValue,
          currentMetadatas.value
        )

        createDefaultInputFields(path, {...updatedValue, tag })
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

function watchOriginalMetadatas(isAllMetadatas : boolean){
  watchSelectFilesChange()
}

watch(metasGenerated, genereteTagsInitial, { once: true });
watch(selectedReferenceMeta, watchSelectFilesChange, { deep: true });
watch(isOpenAllMetadatas, watchOriginalMetadatas);

function handleShowUpAllMetadatas() {
  isOpenAllMetadatas.value = !isOpenAllMetadatas.value
}

</script>
