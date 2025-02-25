import { 
  CurrentUserMetadatas, 
  GenMetadatasResult, 
  GenTagKey,
  MetadataValues
} from "@/types/metas-type";
import { defineStore, storeToRefs } from "pinia";
import { h, ref, toRaw, watch } from "vue";
import { useNotification } from "./notifications";
import { useModal } from "./modal";
import * as R from "ramda";
import ErrorsDetailModal from "@/components/ErrorsDetailModal.vue";
import { Tags } from "@/types/tags";
import { ChangeTagProps } from "@/types/vue/references";
import { orderTagValueByIndex } from "../utils/addTag";


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
                tagValue: (`${patternIndex}:${pattern}`)
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

  const updateByPathReference = R.curry((
    [path, tag] : [string, string], 
    tagValue: string,
    metadatas ?: MetadataValues
  ) => {
    currentMetadatas.value[path] = R.assoc(
      tag, 
      { tagValue, status: "EDITED" }, 
      ( metadatas || currentMetadatas.value[path])
    );

    return currentMetadatas.value[path]
  })


  function changeTagsReferences(
    path: string, 
    {
      currentTag,
      currentIndexTag,
      updateNewTag,
      codePattern,
      isPathUnique,
      isNextToTag,
    } : ChangeTagProps
  ){
    const metadatas = currentMetadatas.value[path];
    const hasCurrrentTag = R.hasIn(currentTag, metadatas);
    const hasUpdateTag = R.hasIn(updateNewTag, metadatas);

    // all references : vai evitar erros em metadatas não existentes
    if(!hasCurrrentTag && !isPathUnique) return;
      
    currentMetadatas.value[path] = R.assoc(
      updateNewTag, { 
        tagValue: isNextToTag ? 
          orderTagValueByIndex(
            metadatas[updateNewTag as keyof Tags].tagValue, 
            hasCurrrentTag ? 
            metadatas[currentTag as keyof Tags].tagValue :
            (`${currentIndexTag}:${currentTag}`)
          ) :
        
          hasCurrrentTag ? 
          metadatas[currentTag as keyof Tags].tagValue :
          (`${currentIndexTag}:${currentTag}`),
        status: "GENERATED"
      }, 
      metadatas
    )
    
    currentMetadatas.value[path] = R.dissoc(
      currentTag as keyof Tags, 
      currentMetadatas.value[path]
    );
    
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