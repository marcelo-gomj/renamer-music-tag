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
  error ?: { 
    name : 'no-sources' | 'source-error',
    pathErrors ?: string[]
  }
}>

type CurrentMetaSave = { [path: string] : {[ metakey in keyof Tags ] : FieldUniqueValue }} 

export { 
  ObjectTransformer, 
  MetaObjectResult, 
  CurrentMetaSave,
  MetasAsMethod, 
  MetaResult, 
  ReturnMetas ,
  MetaKeys, 
  MetaValue
}