import { GenTagKey } from "../metas-type"
import { Tags } from "../tags"

export type ArrayTagRepeats = { 
  [key in keyof Tags] : ({ 
    patternIndex: number, 
    listIndex: number 
  })[] 
}

export type PathIndexReferences = {
  [path: string] : {
    patternKey: string, 
    repeats: ArrayTagRepeats
  }
}
 
export type PatternReferences = {
  [pattern: string] : GenTagKey[]
}

export type ReducePatternsObject = {
  pathIndexedByPatterns : PathIndexReferences,
  patterns : PatternReferences
}

export type PatternInterfaces = { 
  tagName: GenTagKey | string,
  isTag : boolean,
  isMultiTag: boolean,
  icon?: any,  
  label?: string 
}

export type ChangeTagProps = {
  currentTag: string,
  updateNewTag: string,
  codePattern : string,
  currentIndexTag: number,
  isNextToTag: boolean
}

export type PatternListProps = PatternInterfaces []

export type CurrentPatternReference = { 
  patternKey: string, 
  patternProps: (GenTagKey | GenTagKey[] | string)[]
}

export type ContextListOptions = string[];