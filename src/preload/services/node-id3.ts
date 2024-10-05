import NodeID3 from "node-id3";
import * as R from "ramda";
import { CurrentUserMetadatas } from "src/types/metas-type";
import { readFile } from "fs/promises"

const editMusicMetadatas = async ( newMetadatas: CurrentUserMetadatas) => {
  const updatedFiles = [];
  const errorFiles = [];
  for(const path in newMetadatas){
    const metadatas = newMetadatas[path];
    
    try{
      await NodeID3.Promise.update(R.map(metadata => metadata.tagValue, metadatas), path)
      updatedFiles.push(path)
    }catch{
      errorFiles.push(path)
    }
  }

  return {
    ...(errorFiles.length ? { errors: errorFiles } : null),
    ...(updatedFiles.length ? { updates : updatedFiles } : null) 
  }
}

const readMusicMetadatas = async ( filePaths: string[] ) => {
  let fileSourceMetadatas : { metadatas : NodeID3.Tags , path: string }[] = [];
  let pathErrors : string[] = [];

  for(const path of filePaths){
    try{
      const fileBuffer = await readFile(path);
      const metadatas = await NodeID3.Promise.read(fileBuffer);
      
      fileSourceMetadatas = [...fileSourceMetadatas, { metadatas, path }];
    }catch(err){
      console.log(err)
      pathErrors = [...pathErrors, path];
    }
  }

  return { fileSourceMetadatas, pathErrors };
}

export default {
  editMusicMetadatas,
  readMusicMetadatas
}