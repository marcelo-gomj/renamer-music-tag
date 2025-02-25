import { GenTagKey } from "../metas-type";

export type PathIndexReferences = {
  [path: string] : string
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
  isPathUnique: boolean,
  isNextToTag: boolean
}

export type PatternListProps = PatternInterfaces[];

export type CurrentPatternReference = { 
  patternKey: string, 
  patternProps: (GenTagKey | GenTagKey[] | string)[]
}

export type ContextListOptions = string[];