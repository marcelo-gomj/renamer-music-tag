import { defineStore } from "pinia";
import { ref } from "vue";

export const usePathSelection = defineStore('selections', () => {
  const pathSelections = ref<Set<string>>(new Set());

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
    isPathSelected,
    selectPath,
    selectOnePath
  }

})
