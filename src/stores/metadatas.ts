import { CurrentMetaSave, MetadatasResult, MetaSaveValues } from "@/types/metas-type";
import { defineStore } from "pinia";
import { h, ref, unref, watch } from "vue";
import { useNotification } from "./notifications";
import { useModal } from "./modal";
import * as R from "ramda";
import ErrorsDetailModal from "@/components/ErrorsDetailModal.vue";
import { FieldUniqueValue } from "@/types/vue-types";

export const useMedatas = defineStore('metadatas', () => {
  const metadatasGenereted = ref<MetadatasResult[]>([]);
  const sourceDirectory = ref<string[]>([]);
  const currentMetadatas = ref<CurrentMetaSave>({});
  const { notify } = useNotification();
  const { show } = useModal();

  const { generateMetadatasByPaths } = window.api.metas;

  async function updateSourceDirectory(paths: string[], isUpdate = false){
    const { results, errorPaths } = await generateMetadatasByPaths(R.clone(paths));
    console.log("RESULTS", results);

    if(errorPaths.length){
      notify({
        title: errorPaths.length + ' arquivos com problemas',
        id: Date.now(),
        type: 'ERROR',
        context: 'Verfique novamente as fontes que você adicionou',
        actionButton: () => show({ 
          title : 'Erros', 
          content: h(ErrorsDetailModal, { paths: errorPaths, type: 'error' })
        })
      }) 
    }

    if(R.length(results)){
      metadatasGenereted.value = isUpdate ?
      [...metadatasGenereted.value, ...results] :
      results;

      for(const { path, metadatas } of metadatasGenereted.value){
        for(const tag in metadatas){
          currentMetadatas.value[path] = R.assocPath(
            [tag], { status: 'GENERATED', tagValue: metadatas[tag].pattern },
            currentMetadatas.value[path] 
          )
        }
      }
    }
  }

  const watchSourceUpdates = (paths: string[]) => {
    updateSourceDirectory(paths);
  }

  watch(sourceDirectory, watchSourceUpdates, { deep : true });
  watch(currentMetadatas, () => {
    console.log("METADATAS", currentMetadatas.value)
  })

  function updateByPathReference([path, tag] : string[], value: FieldUniqueValue ){
    currentMetadatas.value[path] = R.assocPath(
      [tag], value,
      currentMetadatas.value[path]
    );
  }

  function updateSource(paths: string[]){
    sourceDirectory.value = paths
  }

  return {
    currentMetadatas,
    metadatasGenereted,
    sourceDirectory,
    updateByPathReference,
    updateSource
  }
})