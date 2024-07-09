type MetasAsMethod = 
  "track" | 
  "title" | 
  "year" | 
  "feat" | 
  "artist" | 
  "disc" | 
  "album" ;

type MetaKeys <T> =  { [key in MetasAsMethod] : T }
type MetaValue = { value: string, patternIndex ?: number};
type ObjectTransformer = MetaKeys<TransformMetaFunction>
type MetaObjectResult = Partial<MetaKeys<MetaValue>> 
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




export { ObjectTransformer, MetaObjectResult, MetasAsMethod, MetaResult }