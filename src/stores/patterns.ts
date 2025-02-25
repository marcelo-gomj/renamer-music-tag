import { 
  CurrentPatternReference,
  PathIndexReferences, 
  PatternReferences 
} from "@/types/vue/references";
import { defineStore, storeToRefs } from "pinia";
import { reactive, watch } from "vue";
import { useMedatas } from "./metadatas";
import { GenTagKey } from "@/types/metas-type";
import * as R from "ramda";
import { reOrderTagList } from "@/utils/filter";

export const usePatterns = defineStore('patternsGlobal', () => {
  const { currentMetadatas } = storeToRefs(useMedatas());
  let currentPattern = reactive<CurrentPatternReference>({ 
    patternKey: undefined, 
    patternProps: [] 
  });
  let pathReferences = reactive<PathIndexReferences>({});
  let patternReferences = reactive<PatternReferences>({ 
    all: undefined 
  })

  const changePatternGlobal = (
    pattern : Partial<CurrentPatternReference>
  ) => {
    currentPattern.patternKey = pattern?.patternKey || currentPattern.patternKey;
    currentPattern.patternProps = pattern?.patternProps || currentPattern.patternProps;
  }

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
      pathReferences[path] = matchPatternKey;
      return;
    }

    const newPatternKey = 'p' + (patternEntries.length + 1);
    patternReferences[newPatternKey] = patternModel; 
    pathReferences[path] = newPatternKey;
  }

  const cleanPatternUnless = () => {
    const da = R.flow(
      pathReferences,[
        R.values,
        R.uniq,
        R.difference(R.keys(patternReferences)),
        (excludePaths: string[]) => {
          excludePaths.forEach((patternKey) => {
            if(patternKey === 'all') return;
            delete patternReferences[patternKey];
          })
        }
      ]
    )
  }

  return {
    currentPattern,
    pathReferences,
    cleanPatternUnless,
    patternReferences,
    changePatternGlobal,
    watchMetadatasPattern
  }
})