import * as R from "ramda";
import { readdir, stat } from "fs/promises";
import {  
  ObjectTransformer, 
  MetaObjectResult, 
  MetasAsMethod, 
  ReturnMetas 
} from "../types/metas-type";

const matchFeatArtist = R.match(/(?<=(feat|ft|part)\..?)(\w+(\s|_|-|.))+/ig);
const matchInfoStrings = R.match(/(?:\d*.?(?:[a-zà-ú&]+)+.?\d*)+/ig);
const matchDisc = R.match(/(?<=(disc|cd|vol)\.?.)(\d+)/ig);
const matchYearTrack = R.match(/\d{4}/ig);
const matchTrackNumber = R.match(/(?:(\d+)(\.\d+)?)/ig);

type ReturnWrapField = (MetaObjectResult | string[]);
type MatchFnFunction = (str: string) => RegExpMatchArray; 
type ReturnFnObject = (match: RegExpMatchArray, metas: MetaObjectResult, index: number) => ReturnWrapField;

const matchWrapField = ( matchFn: MatchFnFunction, fnCallback:  ReturnFnObject ) => {
  return (pattern: string, metas?: MetaObjectResult, index?: number) : ReturnWrapField => {
    const match = matchFn(pattern);
    if(match.length && metas){
      return fnCallback(match, metas, index)
    }

    return [] as string[]
  }
}

type WrapFunctionType = ReturnType<typeof matchWrapField>;

const matchArtist : WrapFunctionType = matchWrapField( 
  matchInfoStrings, 
  (match, metas, index) => { 
    return {
      artist: metas.title,
      title: metas.album,
      album: { value : match[0], patternIndex : index }
    }
})

const addFeatArtist : WrapFunctionType = matchWrapField(
  matchFeatArtist, (match, metas)  => {
  
  return {
    artist: { ...metas.artist, value : `${metas.artist.value}/${match[0]}` },
    feat : null
  }
})

const generateMetas = R.curry((
  obj: ObjectTransformer, 
  patterns: string[], 
  extension: string
) => {
  let metadatas = {};
  for (const patternIndex in patterns) {
    for (const method in obj) {
      const methodGenerate = obj[method as MetasAsMethod];

      if (!R.hasIn(method, metadatas)) {
        const metaGenerated = methodGenerate(
          patterns[patternIndex], 
          metadatas, 
          Number(patternIndex)
        );
          
        if(R.is(Array, metaGenerated) && metaGenerated.length){
          metadatas = {
            ...metadatas,
            ...{[method]: { 
              value: metaGenerated[0], 
              patternIndex: Number(patternIndex), 
            }}
          }
          break;
        }
        
        if(R.type(metaGenerated) === "Object"){
          metadatas = {
            ...metadatas,
            ...metaGenerated              
          }
          break;
        }

      }
    }
  }

  return { 
    metadatas, 
    patterns: [...patterns, "." + extension ]
  }
})

const metaObjectFunction : ObjectTransformer = {
  partOfSet: matchDisc,
  trackNumber: matchTrackNumber,
  title: matchInfoStrings,
  album: matchInfoStrings,
  artist: matchArtist,
  year: matchYearTrack,
  feat: addFeatArtist
}

const generateMetasByMethods = generateMetas(metaObjectFunction);

function capitalizeRawStrings(word : string){
  return word.trim().toLowerCase().split(' ').map(
    w => w[0] ? w[0].toUpperCase() + R.tail(w) : ""
  ).join(' ')
}

function splitPatternsName(filename: string){
    // const musicNamePatterns = filename.split(/(-|(?:part|ft|feat)\.|\(|\)|^\d+(?:\.\d+)?)/ig)
    const musicNamePatterns = filename.split(
      /(-|(?:(?:part|ft|feat)\.?.?\w*\s?\w*)|\(|\)|^\d+(?:\.\d+))/ig
    )
  return R.reduce((patterns: string[], word: string) => {
    const wordTrimmed = capitalizeRawStrings(word);

    return wordTrimmed ? [...patterns, wordTrimmed] : patterns
  }, [] as string[], musicNamePatterns)
}

function excludeArrayExtensionName(filename: string[]){
  // check duplicate extension name
  if(R.nth(-1, filename) === R.nth(-2, filename)){
    return R.slice(0, -2, filename)
  }

  return R.init(filename)
}

const hasFileSupport = (path: string ) => R.includes( 
  R.last(R.split(".", path)), 
  [
    "mp3", "mp4", "flac", 
    "ogg", "mkv", "m4a", "aac", 
    "mka", "wav", "wma"
  ]
)

const getSubFilesAndCheckSupportPaths = async (paths: string[]) => {
  let pathsFiltered : string[] = []
  let pathErrors : string[] = [];

  for(const path of paths){
    try{
      const isFolder = await stat(path)
    
      if(isFolder.isDirectory()){
        const subPaths = await readdir(path);
        pathsFiltered = [
          ...pathsFiltered, 
          ...R.filter(hasFileSupport, subPaths)
        ];
        break;
      }
    }catch (_){
      pathErrors = [...pathErrors, path]
    }
    

    if(hasFileSupport(path)){
      pathsFiltered = [...pathsFiltered, path]
    }
  }

  return { pathsFiltered, pathErrors }
}

const checkListPaths = (list: string[]) => R.length(list) === 0;

const generateMetasByDir = async (paths: string[]) : ReturnMetas => {
  if(checkListPaths(paths)) return ({ error: { name: 'no-sources' }});

  const { 
    pathErrors,
    pathsFiltered 
  } = await getSubFilesAndCheckSupportPaths(paths);


  if(checkListPaths(pathsFiltered)) return ({ error: { name: 'no-sources' }});

  const results = R.map( file => {
    const extensionSeparator = R.split(".", R.last(R.split("\\", file)) || '');

    const [ filenameInitial, extension ] = R.juxt([ 
      excludeArrayExtensionName, 
      list => R.last(list)
    ])(extensionSeparator);
    
    const rawFilename = R.join(".", filenameInitial);
   
    if(rawFilename){
      return {
        ...generateMetasByMethods(
          splitPatternsName(rawFilename), 
          extension
        ),
        path: file
      }
    }

    return null
  }, pathsFiltered )

  return { 
    results, 
    ...( 
      R.length(pathErrors) ? 
      { error : { name: "source-error", pathErrors }} 
      : {}
    ) 
  }
}

export { generateMetasByDir };