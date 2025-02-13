import { defineStore } from "pinia";
import { ref } from "vue";
import { useMedatas } from "./metadatas";
import { storeToRefs } from 'pinia';
import * as R from 'ramda';

export const usePathSelection = defineStore('selections', () => {
  const pathSelections = ref<Set<string>>(new Set());
  const { metadatasGenereted } =  storeToRefs(useMedatas());

  const getAllPaths = () => {
    return pathSelections.value.size === 0 ? (
      R.pluck('path', metadatasGenereted.value)
    ) : [...pathSelections.value.keys()]
  }

  function isPathSelected(path: string){
    return pathSelections.value.has(path);
  }

  function selectPath(path: string){
    const isSelected = isPathSelected(path) ? 'delete' : 'add';
    pathSelections.value[isSelected](path)
  }

  function selectOnePath(path: string){
    pathSelections.value.clear();
    pathSelections.value.add(path); 
  }

  return {
    pathSelections,
    getAllPaths,
    isPathSelected,
    selectPath,
    selectOnePath
  }

})
