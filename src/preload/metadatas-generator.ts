import * as R from "ramda";
import { checkSourceFolderFiles } from "./check-sources";
import { sep } from 'path'
import { 
  GenMetadatasResult, MetaTransformerFunction, 
  GenMetadatas, TagTransformerFunction 
} from "@/types/metas-type";

const matcherWithFunction = R.curry(
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
  const [filePath, extension] = R.split(/\.(?=\w+$)/ig, path);
  const [folder, fileName] =  R.splitAt(-1, R.split(sep, filePath))
  
  return [
    R.join(sep, folder),
    ...fileName, 
    extension
  ]
}

const filterFormatsSupported = (formats: string[]) => (
  (pathProps : string[]) => (
    R.includes(R.last(pathProps), formats) ? pathProps : []
  )
)

const createExtraPattern = (
  isMetadataEmpty: boolean,
   pattern: string,
    index: number
) => {
  return (isMetadataEmpty && R.match(/((?:\w+\W{0,1}\b)+)/ig, pattern).length) ?
  {['pattern-' + index] : { pattern, patternIndex: index }} 
  : null
}

const reducePatterns = (
  patterns: string[], 
  transformers: typeof metaTransformers
) => 
patterns.reduce(( metadatas, pattern, index) => {
  const indexedMetadata = R.reduce((metadatasAcc, [tag, matchRegex, transformer]) => {
    if(R.hasIn(tag, metadatas)) return metadatasAcc;

    const matchPattern = R.map(R.trim, R.match(matchRegex, pattern));
    
    if(!matchPattern[0]) return metadatasAcc;

    if(transformer){
      return R.reduced<GenMetadatas>({
        ...transformer(index, matchPattern, metadatas)
      })
    }

    metadatasAcc[tag] = { pattern: matchPattern[0], patternIndex: index };

    return R.reduced<GenMetadatas>(metadatasAcc)
  }, {} as GenMetadatas, transformers);

  return ({
    ...metadatas,
    ...indexedMetadata,
    ...createExtraPattern(R.isEmpty(indexedMetadata), pattern, index)
  })
}, {} as GenMetadatas)

const cleanPatterns = R.into(
  [],
  R.compose(
    R.filter(R.isNotNil), 
    R.map(R.trim), 
    R.filter(R.isNotEmpty)
  )
)

const generateMetadatas = (transformers : typeof metaTransformers) => (
  pathSplited : string[]
) : GenMetadatasResult[] => {
  if(R.isEmpty(pathSplited)) return [];
  
  const [ folder, filename, extension ] = pathSplited;
  const splitedPattterns = R.split(
    /((?:DISC|VOL).?.?\d+)|([-|\|_|\\|\/])|(?=(?=part|ft|feat|dj|ep)\.?\w+.+\w+?)|(\d+(?:\.\d+)?)|(?:(\(|\)|\[|\]))/ig,
    filename
  )

  const patterns = cleanPatterns(splitedPattterns); 

  return [{
    path: `${folder}${sep}${filename}.${extension}`,
    metadatas: reducePatterns(patterns, transformers),
    patterns
  }]
}

const reducePathMetadatas = R.reduce(
  (results : GenMetadatasResult[], path : string) => (
    [ ...results, ...R.flow(path, [
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
    errorPaths
  }
}

export { generateMetadatasByPaths }
