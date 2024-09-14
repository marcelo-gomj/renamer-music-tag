import { Tags } from "./tags";
import { FieldUniqueValue, FieldValue } from "./vue-types";


type MetasAsMethod = keyof Tags;
type MetaKeys <T> =  { [key in MetasAsMethod] ?: T  }
type MetaValue = { value: string, patternIndex ?: number} | null;
type ObjectTransformer = MetaKeys<TransformMetaFunction>
type MetaObjectResult = Partial<MetaKeys<MetaValue | null>> 
type TransformMetaFunction = (
  pattern: string,
  metaAccumulate ?: MetaObjectResult,
  index ?: number
) => ( MetaObjectResult | string[]);

type MetaResult = {
  metadatas : MetaObjectResult,
  patterns: string[],
  path: string
}

type ReturnMetas = Promise<{
  results ?: MetaResult[],
  errors ?: { 
    name : 'no-sources' | 'source-error',
    pathErrors ?: string[]
  }
}>

type MetaSaveValues = {
  [ metakey in keyof Tags ] : FieldUniqueValue
}

type CurrentMetaSave = { 
  [path: string] : MetaSaveValues
} 

export { 
  ObjectTransformer, 
  MetaSaveValues,
  MetaObjectResult, 
  CurrentMetaSave,
  MetasAsMethod, 
  MetaResult, 
  ReturnMetas ,
  MetaKeys, 
  MetaValue
}