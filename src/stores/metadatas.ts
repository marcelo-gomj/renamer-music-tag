import { 
  CurrentUserMetadatas, 
  GenMetadatasResult, 
  GenTagKey
} from "@/types/metas-type";
import { defineStore } from "pinia";
import { h, ref, toRaw, watch } from "vue";
import { useNotification } from "./notifications";
import { useModal } from "./modal";
import * as R from "ramda";
import ErrorsDetailModal from "@/components/ErrorsDetailModal.vue";
import { FieldUniqueValue } from "@/types/vue/vue-types";
import { Tags } from "@/types/tags";
import { ChangeTagProps } from "@/types/vue/references";

export const useMedatas = defineStore('metadatas', () => {
  const metadatasGenereted = ref<GenMetadatasResult[]>([]);
  const sourceDirectory = ref<string[]>([]);
  const currentMetadatas = ref<CurrentUserMetadatas>({});
  const { notify } = useNotification();
  const { show } = useModal();

  const { generateMetadatasByPaths } = window.api.metas;

  function isNotPatternKey(tag: GenTagKey) : tag is keyof Tags {
    return !tag.startsWith('pattern-');
  }

  async function updateSourceDirectory(paths: string[], isUpdate = false){
    const { results, errorPaths } = await generateMetadatasByPaths(toRaw(paths));

    if(errorPaths.length){
      notify({
        title: errorPaths.length + ' arquivos com problemas',
        id: Date.now(),
        type: 'ERROR',
        context: 'Verfique novamente as fontes que você adicionou',
        actionButton: () => show({ 
          title : 'Erros', 
          content: h(ErrorsDetailModal, { 
            paths: errorPaths, 
            type: 'error' 
          })
        })
      }) 
    }

    if(R.length(results)){
      metadatasGenereted.value = isUpdate ?
      [...metadatasGenereted.value, ...results] 
      : results;

      R.forEach(({ metadatas, path }) => {
        R.forEachObjIndexed(({ pattern, patternIndex }, tag) => {
          if(isNotPatternKey(tag)){
            currentMetadatas.value[path] = R.assocPath(
              [tag], { 
                status: 'GENERATED', 
                tagValue: pattern,
                patternIndex
              },
              currentMetadatas.value[path] 
            )
          }
        },  metadatas)
      }, metadatasGenereted.value)
    }
  }

  const watchSourceUpdates = (paths: string[]) => {
    updateSourceDirectory(paths);
  }

  function updateByPathReference([path, tag] : string[], value: Omit<FieldUniqueValue, 'patternIndex'> ){
    const { patternIndex } = currentMetadatas.value[path][tag as keyof Tags];
    currentMetadatas.value[path] = R.assocPath(
      [tag], { value, patternIndex }, currentMetadatas.value[path]
    );
  }

  function changeTagsReferences(
    path: string, 
    {
      currentTag,
      currentIndexTag,
      updateNewTag,
      codePattern,
      isNextToTag,
    } : ChangeTagProps
  ){
    console.log("PASSOU")
    const metaInitial = currentMetadatas.value[path];
    const metaNewTag = metaInitial[currentTag as keyof Tags];
    const metaOldTag = metaInitial[updateNewTag as keyof Tags];

    console.log("CHANGE PROPS", {
      currentTag,
      currentIndexTag,
      updateNewTag,
      codePattern,
      isNextToTag 
    })
    
    if(R.hasIn(currentTag, metaInitial) && isNextToTag){

      if(codePattern === 'all'){
        currentMetadatas.value[path] = R.evolve({
          [currentTag] : () => metaOldTag,
          [updateNewTag] : () => metaNewTag
        }, metaInitial)

        console.log("1. Algoritimo", currentMetadatas.value[path])

        return;
      }

      if(isNextToTag){
        const isNewTagNextPos =  metaNewTag.patternIndex > (metaOldTag?.patternIndex || currentIndexTag);
        const getTagValuesWithDefault = (isTagNew ?: boolean) => (
          isTagNew ? metaNewTag.tagValue : (metaOldTag?.tagValue || updateNewTag)
        )
        const orderTagValueByIndex =`${getTagValuesWithDefault(isNewTagNextPos)}/${getTagValuesWithDefault(!isNewTagNextPos)}`; 
 
        const mergeTags = R.modify(
          updateNewTag as keyof Tags, 
          ({ patternIndex }: FieldUniqueValue) : Partial<FieldUniqueValue> => ({
            patternIndex,
            status: 'EDITED',
            tagValue: orderTagValueByIndex
          }),
          metaInitial
        )
        
        currentMetadatas.value[path] = R.dissoc(currentTag as keyof Tags, mergeTags);
        console.log("2. Algoritimo", currentMetadatas.value[path])

        return;        
      }
    }

    currentMetadatas.value[path] = {
      [updateNewTag] : {
        tagIndex: (metaOldTag?.patternIndex || currentIndexTag),
        status: 'EDITED',
        tagValue: (metaNewTag?.tagValue || currentTag)
      },
      ...R.dissoc(
        currentTag as keyof Tags, 
        metaInitial
      ),
    }

    console.log("3. Algoritimo", currentMetadatas.value[path])
  }

  function updateSource(paths: string[]){
    sourceDirectory.value = paths
  }

  watch(sourceDirectory, watchSourceUpdates, { deep : true });

  return {
    currentMetadatas,
    metadatasGenereted,
    changeTagsReferences,
    sourceDirectory,
    updateByPathReference,
    updateSource
  }
})