<template>
  <div v-if="metasGenerated?.length" class="flex flex-col w-[45%] overflow-y-hidden h-full">
    <div class="flex font-medium justify-between text-x1 mt-2.5 my-4">
      <div class="flex items-center gap-3">
        <div class="tracking-wider">Metadatas</div>
      </div>

      <div class="text-base-white-800">
        {{ selectedReferenceMeta.length }} dos arquivos referentes
      </div>
    </div>

    <div class="">
      <div v-for="inputProps of createInputField(inputValues)"
        class="group relative text-x1  pl-6 pr-2 my-1 rounded-md hover:bg-base-dark-400 cursor-pointer">
        <div class="flex items-center gap-4" v-if="isOpenAllMetadatas || inputProps.value !== ''">

          <div :class="`absolute left-1 w-1 rounded-full h-4 ${
            inputProps.status === 'GENERATED' ? 'bg-green-400' :
            inputProps.status === 'EDITED' ? 'bg-base-white-400' : ''} shrink-0`" 
          />

          <div class="flex gap-5 items-center w-40">
            <component class="w-4 h-4 text-base-white-700" :is="inputProps.icon" />
            <div class="font-medium text-base-white-700 tracking-wide line-clamp-1">{{ inputProps.tag }}</div>
          </div>

          <div class="flex justify-between items-center w-full">
            <input class="font-medium w-full h-8 bg-[rgb(0,0,0,0)] border-none outline-none"
              :placeholder="inputProps.value === undefined ? 'Variados' : inputProps.value"
              v-model.lazy.trim="getInputPropsComputed(inputProps.tag).value">

            <div class="h-full text-base-white-700 group-hover:text-white">
              <component class="w-[0.85rem] h-[0.85rem]" v-if="inputProps.status === 'GENERATED'" :is="WandSparkles" />
              <component class="w-[0.85rem] h-[0.85rem]" v-if="inputProps.status === 'EDITED'" :is="Edit" />
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="pt-3 text-x1 font-medium opacity-40 hover:opacity-90 cursor-pointer" @click="handleShowUpAllMetadatas">
      Mostrar {{ isOpenAllMetadatas ? 'menos' : 'mais' }} metadatas
    </div>

    <MetadatasControllers />
  </div>
</template>

<script setup lang="ts">
import MetadatasControllers from './MetadatasControllers.vue';
import { Captions, Disc, Tag, Music2, Link2, LucideUsers, CalendarIcon, Edit, WandSparkles } from 'lucide-vue-next';
import { computed, inject, Ref, watch } from 'vue';
import { MetaResult, CurrentMetaSave } from 'src/types/metas-type';
import * as R from "ramda";
import { ref } from 'vue';
import { FieldTagStatus, FieldValue, IndexPathTags, InputDataProps, InputProps } from 'src/types/vue-types';
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
    R.repeat({ tagValue: '', status: 'DEFAULT' as FieldTagStatus }, tagList.length)
  )
}

function isPathSelected(path: string) {
  return selectedReferenceMeta.value.length && !R.includes(path, selectedReferenceMeta.value);
}


function setDefaultFieldInput(
  { tagValue, tag }: { tag: keyof Tags, tagValue: string },
  allFields = false
) {
  if (allFields || inputValues.value[tag].tagValue === '') {
    inputValues.value = R.assocPath([tag], { tagValue, status: 'DEFAULT' }, inputValues.value);
  }
}

async function getAllOriginalMetadatas(allFields = false) {
  if (!isOpenAllMetadatas.value) return;

  if (R.isEmpty(sourceMetadatas.value)) {
    const { fileSourceMetadatas } = await readMusicMetadatas(
      metasGenerated.value.map(meta => meta.path)
    )

    for (const { metadatas, path } of fileSourceMetadatas) {

      const metadatasAcc = sourceMetadatas.value?.[path] || null;

      for (const tag of tagList) {
        const tagValue = metadatas[tag];

        setDefaultFieldInput({ tagValue, tag })

        sourceMetadatas.value = R.assocPath([path, tag], tagValue, sourceMetadatas.value);

      }
    }

    return;
  }

  for (const path in sourceMetadatas.value) {
    if (!isPathSelected(path)) return;

    tagList.forEach((tag) => {
      if (sourceMetadatas.value[path]?.[tag]) {
        setDefaultFieldInput({
          tagValue: sourceMetadatas.value[path][tag],
          tag
        }, allFields)
      }
    })

  }
}

function createDefaultInputFields(
  path: string,
  { tag, tagValue, status }: FieldValue & { tag: keyof Tags }
) {
  if (selectedReferenceMeta.value.length && !R.includes(path, selectedReferenceMeta.value)) return;
  const inputValue = inputValues.value[tag]?.tagValue;

  if (inputValue === '') {
    inputValues.value[tag] = { tagValue, status };
    return;
  }

  if (inputValue && inputValue !== tagValue) {

    inputValues.value[tag] = {
      tagValue: undefined,
      status
    };
  }
}

function genereteTagsInitial(metaResultGenerated: Partial<MetaResult>[]) {
  for (const { path, metadatas } of metaResultGenerated) {
    if (metadatas) {
      currentMetadatas.value[path] = R.mapObjIndexed(({ value }, tag) => {
        const tagValues: FieldValue = {
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
  }, currentMetadatas.value)
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
        currentMetadatas.value = R.assocPath(
          [path, tag],
          { tagValue: inputChanged, status: 'EDITED'},
          currentMetadatas.value
        )
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

watch(metasGenerated, genereteTagsInitial, { once: true });
watch(selectedReferenceMeta, watchSelectFilesChange, { deep: true });
watch(isOpenAllMetadatas, () => { getAllOriginalMetadatas() }, { once: true });

function handleShowUpAllMetadatas() {
  isOpenAllMetadatas.value = !isOpenAllMetadatas.value
}

</script>
