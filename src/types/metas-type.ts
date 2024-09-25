import { Tags } from "./tags";
import { FieldUniqueValue } from "./vue-types";

type TagPattern = {
  pattern: string,
  patternIndex : number | null,  
}

type KeyTag  = (keyof Tags | `pattern-${string}` | string)
type PatternsMetadata = Record<KeyTag, TagPattern>

type MetadatasResult = {
  metadatas : PatternsMetadata,
  path: string,
  patterns: string[]
}

type TagTransformerFunction = (
  index: number, regexPattern: string[] , patterns ?: PatternsMetadata
) => Record<KeyTag, TagPattern>;

type MetaTransformerFunction = [
  keyof Tags | string, RegExp, (TagTransformerFunction | null)
][];

type MetaSaveValues = {
  [ metakey in keyof Tags ] : FieldUniqueValue
}

type CurrentMetaSave = { 
  [path: string] : MetaSaveValues
} 

export {
  TagTransformerFunction,
  MetaTransformerFunction,
  TagPattern,
  PatternsMetadata,
  MetadatasResult,
  MetaSaveValues,
  CurrentMetaSave,
}