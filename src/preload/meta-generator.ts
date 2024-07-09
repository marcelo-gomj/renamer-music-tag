import { includes, init, filter, join, last, map, reduce, split, tail, slice, nth, juxt } from "ramda";
import * as R from "ramda";
import { readdir } from "fs/promises";
import {  ObjectTransformer, MetaObjectResult, MetasAsMethod, MetaResult } from "../types/metas-type";

const matchFeatArtist = R.match(/(?<=(feat|ft|part)\..?)(\w+(\s|_|-|.))+/ig);
const matchInfoStrings = R.match(/(?:\d*.?(?:[a-zà-ú&]+)+.?\d*)+/ig);
const matchDisc = R.match(/(?<=(disc|cd|vol)\.?.)(\d+)/ig);
const matchYearTrack = R.match(/\d{4}/ig);
const matchTrackNumber = R.match(/(?:(\d+)(\.\d+)?)/ig);

const matchArtist = (pattern: string, metas?: MetaObjectResult, index?: number) => {
  const albumReplace = matchInfoStrings(pattern);
  
  if (albumReplace.length && metas) {
    return {
      artist: metas.title,
      title: metas.album,
      album: { value : albumReplace[0], patternIndex : index }
    }
  }

  return [] as string[]
}


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
  disc: matchDisc,
  track: matchTrackNumber,
  title: matchInfoStrings,
  album: matchInfoStrings,
  artist: matchArtist,
  year: matchYearTrack,
  feat: matchFeatArtist
}


const generateMetasByMethods = generateMetas(metaObjectFunction);

function filterInMusicFiles(allFiles: string[]){
  const suportedFiles = [
    "mp3", "mp4", "flac", 
    "ogg", "mkv", "m4a", "aac", 
    "mka", "wav", "wma"
  ];

  return filter((file) => 
    !!includes( 
      last(split(".", file)), 
      suportedFiles
    ), 
    allFiles
  )
}

function capitalizeRawStrings(word : string){
  return word.trim().toLowerCase().split(' ').map(
    w => w[0] ? w[0].toUpperCase() + tail(w) : ""
  ).join(' ')
}

function splitPatternsName(filename: string){
  const musicNamePatterns = filename.split(/(-|(?:part|ft|feat)\.|\(|\)|^\d+(?:\.\d+)?)/ig)

  return reduce((patterns: string[], word: string) => {
    const wordTrimmed = capitalizeRawStrings(word);

    return wordTrimmed ? [...patterns, wordTrimmed] : patterns
  }, [] as string[], musicNamePatterns)
}

function excludeArrayExtensionName(filename: string[]){
  // check duplicate extension name
  if(nth(-1, filename) === nth(-2, filename)){
    return slice(0, -2, filename)
  }

  return init(filename)
}

async function generateMetasByDir(dirPath: string){
  const dirFiles = await readdir(dirPath);
  const filesMusic = filterInMusicFiles(dirFiles);
  const currentFolder = last(split("\\", dirPath));

  return map( file => {
    const extensionSeparator = split(".", last(split("\\", file)) || '');
    const [ filenameInitial, extension ] = juxt([ 
      excludeArrayExtensionName, 
      list => last(list)
    ])(extensionSeparator);
    
    const rawFilename = join(".", filenameInitial);
   
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
  }, filesMusic )
}

export { generateMetasByDir };