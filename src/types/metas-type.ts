import { Tags } from "./tags";
import { FieldValue } from "./vue-types";

type PatternValue = {
  pattern: string,
  patternIndex : number | null,  
}

type GenTagKey  = (keyof Tags | `pattern-${string}`)

type GenMetadatas = {
  [ tags in GenTagKey] ?: PatternValue 
};

type GenMetadatasResult = {
  metadatas : GenMetadatas,
  path: string,
  patterns: string[]
}

type TagTransformerFunction = (
  index: number, 
  regexPattern: string[], 
  patterns ?: GenMetadatas
) => GenMetadatas;

type MetaTransformerFunction = [
  keyof Tags, 
  RegExp, 
  (TagTransformerFunction | null)
][];

type MetadataValues = {
  [ tag in keyof Tags] ?: FieldValue 
};

type CurrentUserMetadatas = {
  [path: string] : MetadataValues 
};

export {
  TagTransformerFunction,
  MetaTransformerFunction,
  PatternValue,
  GenTagKey,
  GenMetadatas,
  GenMetadatasResult,
  MetadataValues,
  CurrentUserMetadatas,
}