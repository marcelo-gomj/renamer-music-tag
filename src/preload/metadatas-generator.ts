import { 
  curry, splitAt, split, reduce, 
  includes, last, join, flow, isEmpty, 
  match, reduced, filter,
  map, trim, 
  hasIn,
  compose,
  isNotEmpty,
  into,
  isNotNil
} from "ramda";

import { checkSourceFolderFiles } from "./check-sources";
import { 
  MetadatasResult, MetaTransformerFunction, 
  PatternsMetadata, TagTransformerFunction 
} from "@/types/metas-type";

const matcherWithFunction = curry(
  (rgx: RegExp, tag: string, fn ?: TagTransformerFunction ) => (
  [tag, rgx, fn]
))

const matchLongString = matcherWithFunction(/(?:\d*.?(?:[a-zà-ú&]+)+.?\d*)+/ig);

const albumTagTrasformer : TagTransformerFunction = (index, matchesArray, metadatas) => ({
  'artist' : metadatas['title'],
  'title' : metadatas['artist'],
  'album' : { pattern: matchesArray[0], patternIndex: index }
})

// Matcher for each tags 
const metaTransformers : MetaTransformerFunction = [
  ['partOfSet', /(?<=(disc|cd|vol)\.?.)(\d+)/ig, null],
  ['trackNumber', /(?:(\d+)(\.\d+)?)/ig, null],
  ['performerInfo', /(?<=\b(feat|part|ft|dj)\.?\s*)\b(\w+\W?)+/gi, null],
  matchLongString('title', null),
  matchLongString('artist', null),
  matchLongString('album', albumTagTrasformer),
  ['year', /\d{4}/ig, null],
]

// node-id3 support 
const formatsSupported = [
  "mp3", "mp4", "flac", 
  "ogg", "mkv", "m4a", "aac", 
  "mka", "wav", "wma"
]

const splitPathByExtension = (path: string) => {
  const [filePath, extension] = split(/\.(?=\w+$)/ig, path);
  const [folder, fileName] =  splitAt(-1, split('\\', filePath))
  
  return [
    join("\\", folder),
    ...fileName, 
    extension
  ]
}

const filterFormatsSupported = (formats: string[]) => (
  (pathProps : string[]) => (
    includes(last(pathProps), formats) ? pathProps : []
  )
)

const createExtraPattern = (
  isMetadataEmpty: boolean,
   pattern: string,
    index: number
) => {
  return (isMetadataEmpty && match(/((?:\w+\W{0,1}\b)+)/ig, pattern).length) ?
  {['pattern-' + index] : { pattern, patternIndex: index }} 
  : null
}

const reducePatterns = (
  patterns: string[], 
  transformers: typeof metaTransformers
) => 
patterns.reduce(( metadatas, pattern, index) => {
  const indexedMetadata = reduce((metadatasAcc, [tag, matchRegex, transformer]) => {
    if(hasIn(tag, metadatas)) return metadatasAcc;

    const matchPattern = map(trim, match(matchRegex, pattern));
    
    if(!matchPattern[0]) return metadatasAcc;

    if(transformer){
      return reduced<PatternsMetadata>({
        ...transformer(index, matchPattern, metadatas)
      })
    }

    metadatasAcc[tag] = { pattern: matchPattern[0], patternIndex: index };

    return reduced<PatternsMetadata>(metadatasAcc)
  }, {} as PatternsMetadata, transformers);

  return ({
    ...metadatas,
    ...indexedMetadata,
    ...createExtraPattern(isEmpty(indexedMetadata), pattern, index)
  })
}, {} as PatternsMetadata)

const cleanPatterns = into(
  [],
  compose(filter(isNotNil), map(trim), filter(isNotEmpty))
)

const generateMetadatas = (transformers : typeof metaTransformers) => (
  pathSplited : string[]
) : MetadatasResult[] => {
  if(isEmpty(pathSplited)) return [];
  
  const [ folder, filename, extension ] = pathSplited;
  const splitedPattterns = split(
    /((?:DISC|VOL).?.?\d+)|(?:-)|(?=(?=part|ft|feat|dj|ep)\.?\w+.+\w+?)|(\d+(?:\.\d+)?)|(?:(\(|\)|\[|\]))/ig,
    filename
  )

  const patterns = cleanPatterns(splitedPattterns); 

  return [{
    path: folder + '\\' + filename + '.' + extension,
    metadatas: reducePatterns(patterns, transformers),
    patterns
  }]
}

const reducePathMetadatas = reduce(
  (results : MetadatasResult[], path : string) => (
    [ ...results, ...flow(path, [
      splitPathByExtension,
      filterFormatsSupported(formatsSupported),
      generateMetadatas(metaTransformers)
    ]
  )]
));

const generateMetadatasByPaths = async (paths: string[]) => {
  const { errorPaths, filePaths } = await checkSourceFolderFiles(paths);

  return { 
    results: reducePathMetadatas([], filePaths), 
    errorPaths : ['fef']
  }
}

export { generateMetadatasByPaths }
