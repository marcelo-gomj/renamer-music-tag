import NodeID3 from "node-id3";
import * as R from "ramda";
import { MetaResult } from "src/types/metas-type";
import { MetaKeys } from "../../types/metas-type";
import { readFile } from "fs/promises"

const editMusicMetadatas = async ({ 
  metadatas, 
  path 
}: MetaResult) => {
  const {
    album, artist, 
    partOfSet, year, 
    feat, title, trackNumber
  } = R.reduce(
    (accMetadatas, [ key, meta ]) => ({ ...accMetadatas, [key] : meta.value }), 
    {} as MetaKeys<string>, 
    R.toPairs(metadatas)
  )

  try{
    const isUpdated = await NodeID3.Promise.update({
      title,
      album,
      year,
      trackNumber,
      artist,
      partOfSet, 
    }, path)

    return isUpdated ? path : null
  }catch(_){
    return null
  }
}

const readMusicMetadatas = async ( filePaths: string[] ) => {
  let fileSourceMetadatas : { metadata : NodeID3.Tags , path: string }[] = [];
  let pathErrors : string[] = [];

  for(const path of filePaths){
    try{
      const fileBuffer = await readFile(path);
      const metadata = await NodeID3.Promise.read(fileBuffer);
      
      fileSourceMetadatas = [...fileSourceMetadatas, { metadata, path }];
    }catch(_){
      pathErrors = [...pathErrors, path];
    }
  }

  return { fileSourceMetadatas, pathErrors };
}

export default {
  editMusicMetadatas,
  readMusicMetadatas
}