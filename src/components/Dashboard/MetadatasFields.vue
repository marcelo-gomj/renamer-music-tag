<template>
  <div v-if="metasGenerated?.length" class="flex flex-col w-[45%] overflow-y-hidden h-full">
    <div class="flex font-medium justify-between text-x1 mt-2.5 my-4">
      <div class="flex items-center gap-3">
        <div class="tracking-wider">Metadatas</div>
      </div>

      <div class="text-base-white-800">
        {{ metasGenerated.length }} arquivos referentes
      </div>
    </div>

    <div class="">
      <div v-for="inputProps of createInputField(inputValues)"
        class="group relative text-x1  pl-6 pr-2 my-1 rounded-md hover:bg-base-dark-400 cursor-pointer">
        <div class="flex items-center gap-4" v-if="isOpenAllMetadatas || inputProps.value !== ''">

          <div :class="`absolute left-1 w-1 rounded-full h-4 ${inputProps.status === 'GENERATED' ? 'bg-green-400' :
            inputProps.status === 'EDITED' ? 'bg-base-white-400' : ''} shrink-0`" />
          <div class="flex gap-5 items-center w-24">
            <component class="w-4 h-4 text-base-white-700" :is="inputProps.icon" />
            <div class="font-medium text-base-white-700 tracking-wide line-clamp-1">{{ inputProps.tag }}</div>
          </div>

          <div class="flex justify-between items-center w-full">
            <input class="font-medium w-full h-8 bg-[rgb(0,0,0,0)] border-none outline-none"
              :placeholder="inputProps.value === undefined ? 'Variados' : inputProps.value"
              value="inputProps."
              v-model.trim.lazy="inputValues[inputProps.tag]"

              >

            <div class="h-full text-base-white-700 group-hover:text-white">
              <component class="w-[0.85rem] h-[0.85rem]" v-if="inputProps.status === 'GENERATED'" :is="WandSparkles" />
              <component class="w-[0.85rem] h-[0.85rem]" v-if="inputProps.status === 'EDITED'" :is="Edit" />
              <!-- <component class="w-[0.85rem] h-[0.85rem] group-hover:visible invisible" :is="Edit" /> -->
            </div>
          </div>

        </div>
      </div>
    </div>

    <div 
      class="pt-3 text-x1 font-medium opacity-40 hover:opacity-90 cursor-pointer" 
      @click="handleShowUpAllMetadatas"
    >
      Mostrar {{ isOpenAllMetadatas ? 'menos' : 'mais'}} metadatas
    </div>

    <MetadatasControllers />
  </div>
</template>

<script setup lang="ts">
import MetadatasControllers from './MetadatasControllers.vue';
import { Captions, Disc, Tag, Music2, Link2, LucideUsers, CalendarIcon, Edit, WandSparkles } from 'lucide-vue-next';
import {  inject, Ref, unref, watch } from 'vue';
import { MetaResult, CurrentMetaSave } from 'src/types/metas-type';
import { assocPath, clone, indexBy, isEmpty, keys, pick, prop, toPairs, values, cond, includes } from 'ramda';
import { ref } from 'vue';
import NodeID3 from 'node-id3';
import { InputDataProps } from 'src/types/vue-types';
import { Tags } from 'src/types/tags';


const { editMusicMetadatas, readMusicMetadatas } = window.api.nodeID3;

const metasGenerated = inject<Ref<MetaResult[]>>("referenceFiles");
const selectedReferenceMeta = inject<Ref<string[]>>('currentReferencesMeta')
const sourceMetadatas = ref<{[path: string ] :{ metadatas: Partial<NodeID3.Tags>, path: string} }>({});
const currentMetadatas = ref<CurrentMetaSave>({})
const isOpenAllMetadatas = ref(false);
const inputValues = ref<Tags>({
  album: "", artist: "", genre: "",
  title: "", year: "", trackNumber: "",
  partOfSet: "", date: "", publisher: "", copyright: ""
});

const saveCurrentDataInputs = (metadataResults : CurrentMetaSave) => {
  toPairs(metadataResults).forEach(([ path, metadatas ]) => {
    toPairs(inputValues.value).forEach(([ inputField, inputValue ]) => {

      if(!inputValue) return;

      if(
        (metadatas[inputField] && inputValue !== metadatas[inputField].value) ||
        (!isEmpty(sourceMetadatas.value) &&
        sourceMetadatas.value[path].metadatas[inputField as keyof NodeID3.Tags] !== inputValue)
      ){

        currentMetadatas.value[path] = {
          ...currentMetadatas.value[path], 
          [inputField] : { value: inputValue, patternIndex: null }
        }; 

      }
    })
  })

  console.log("CURRENT METADATAS", clone(currentMetadatas.value))
  console.log("INPUT VALUES", clone(inputValues.value))
}

const watchAutoSaveInput = () => {
  if(selectedReferenceMeta.value.length){
    const selectedMetas = pick(selectedReferenceMeta.value, currentMetadatas.value);
    
    saveCurrentDataInputs(
      selectedMetas
    );

    return;
  }

  saveCurrentDataInputs(currentMetadatas.value);
}

const generateDefaultInputs = () => {
  toPairs(currentMetadatas.value).forEach(([path, metadatas]) => {
    toPairs(metadatas).forEach(([metaKey, MetaValue]) => {
      if (metaKey === "feat") return;
      if(selectedReferenceMeta.value.length && !includes(path, selectedReferenceMeta.value)) return;
      
        const inputValue = inputValues.value[metaKey];
  
        if (inputValue === '') {
          inputValues.value[metaKey] = MetaValue.value;
          return;
        }
      
        if( inputValue && inputValue !== MetaValue.value) {
          inputValues.value[metaKey] = undefined;
        }
      })
    
  })
}

const setCurrentMetadatas = (metaResults: Partial<MetaResult>[]) => {
  const IndexPathResults = indexBy(prop('path'), metaResults);

  
  toPairs(IndexPathResults).forEach(([path, { metadatas }]) => {

    if(metadatas){
      currentMetadatas.value[path] = metadatas;
    }
  })
}

const checkMetasGenarete = (metaResultGenerated: Partial<MetaResult>[]) => {
  setCurrentMetadatas(metaResultGenerated)
  generateDefaultInputs()
}

const checkAllOriginalMetadatas = async (isOpen: boolean ) => {
  if(isOpen){
    const { fileSourceMetadatas } = await readMusicMetadatas(
      metasGenerated.value.map( meta => meta.path )
    )

    sourceMetadatas.value = indexBy(prop('path'), fileSourceMetadatas);

    values(sourceMetadatas.value).forEach(({ metadatas }) => {
      keys(inputValues.value).forEach((tag) => {
        if(tag === 'feat') return;

        const inputValue = inputValues.value[tag];

        if(metadatas[tag] && inputValue === ''){
          inputValues.value[tag] = metadatas[tag]
        }
      })
    }) 
  }
}

const iconsByMetadatas = (tag: keyof Tags | string) => ({
  "trackNumber": Music2,
  "title": Captions,
  "album": Disc,
  "feat": Link2,
  "artist": LucideUsers,
  "partOfSet": Disc,
  "year": CalendarIcon,
}[tag] || Tag);

const createInputField = (tags: Tags): InputDataProps => (
  toPairs(tags).map(
    ([key, value]) => {

    return ({
      tag: key,
      icon: iconsByMetadatas(key),
      status: value ? "GENERATED" : 'DEFAULT',
      value
    })}
  )
);

const watchSelectFilesChange = () => {
  keys(inputValues.value).forEach((tag) => {
    inputValues.value[tag] = '';
  })

  generateDefaultInputs();

}

watch(metasGenerated, checkMetasGenarete);
watch(selectedReferenceMeta, watchSelectFilesChange, { deep: true});
watch(inputValues, watchAutoSaveInput, { deep : true });
watch(isOpenAllMetadatas, checkAllOriginalMetadatas, { once: true });


const handleShowUpAllMetadatas = () => {
  isOpenAllMetadatas.value = !isOpenAllMetadatas.value
}

</script>
