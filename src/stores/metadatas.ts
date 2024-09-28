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
import { FieldUniqueValue } from "@/types/vue-types";
import { Tags } from "@/types/tags";

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
        R.forEachObjIndexed(({ pattern }, tag) => {
          if(isNotPatternKey(tag)){
            currentMetadatas.value[path] = R.assocPath(
              [tag], { 
                status: 'GENERATED', 
                tagValue: pattern
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

  function updateByPathReference([path, tag] : string[], value: FieldUniqueValue ){
    currentMetadatas.value[path] = R.assocPath(
      [tag], value, currentMetadatas.value[path]
    );
  }

  function updateSource(paths: string[]){
    sourceDirectory.value = paths
  }

  watch(sourceDirectory, watchSourceUpdates, { deep : true });

  return {
    currentMetadatas,
    metadatasGenereted,
    sourceDirectory,
    updateByPathReference,
    updateSource
  }
})