import { ArrayTagRepeats, CurrentPatternReference, PathIndexReferences, PatternReferences } from "@/types/vue/references";
import { defineStore, storeToRefs } from "pinia";
import { reactive, ref, watch } from "vue";
import { useMedatas } from "./metadatas";
import { GenMetadatas, GenTagKey } from "@/types/metas-type";
import * as R from "ramda";

export const usePatterns = defineStore('patternsGlobal', () => {
  const { currentMetadatas } = storeToRefs(useMedatas());
  let currentPattern = reactive<CurrentPatternReference>({ 
    patternKey: undefined, 
    patternProps: [] 
  });
  let pathReferences = reactive<PathIndexReferences>({});
  let patternReferences = reactive<PatternReferences>({ all: undefined })

  const changePatternGlobal = (
    pattern : Partial<CurrentPatternReference>
  ) => {
    currentPattern.patternKey = pattern?.patternKey || currentPattern.patternKey;
    currentPattern.patternProps = pattern.patternProps || currentPattern.patternProps;
  }

  type MetadatasFieldsGenerics <T> = { [key in GenTagKey] ?: T extends undefined ? any : T };

  const checkTagPatternExtension = (
    metadatas : MetadatasFieldsGenerics<any>
  ) => R.modifyPath(
    R.keys(metadatas),
    (tagValue: string) : R.ValueOfUnion<ArrayTagRepeats> => (
      R.split('/', tagValue).map((value, index, list) => (
        { listIndex: , patternIndex: index }
      ))
    ),
    metadatas
  );

  const createDefaultReferenceModel = (
    metadatas : MetadatasFieldsGenerics<any>
  ) => (
    patternId: string | number,
  ) => ({
    patternKey: String(patternId),
    repeats: checkTagPatternExtension(metadatas)
  })

  const watchMetadatasPattern = (
    { metadatas, path } : { 
      metadatas: { [key in GenTagKey] ?: any}, 
      path: string 
    },
    index: number
  ) => {
    const patternModel = R.keys(metadatas);
    const patternEntries = R.toPairs(patternReferences);
    
    const matchPatternKey = R.reduce((pattern, [patternKey, model]) => (
      R.equals(patternModel, model) ?
      R.reduced(patternKey) :
      pattern
    ),
      undefined as string, 
      patternEntries
    );

    
    if(matchPatternKey){
      pathReferences[path] = createDefaultReferenceModel(matchPatternKey);
      return;
    }

    const newPatternKey = 'p' + patternEntries.length + 1;
    patternReferences[newPatternKey] = patternModel; 
    pathReferences[path] = createDefaultReferenceModel(newPatternKey);
  }

  return {
    currentPattern,
    pathReferences,
    patternReferences,
    changePatternGlobal,
    watchMetadatasPattern
  }
})