import * as R from "ramda";
import { readdir, stat } from "fs/promises";

export const checkSourceFolderFiles = async (paths: string[]) => {
  const filePaths  : string[] = [];
  const errorPaths : string[] = [];

  for(const path of paths){
    try{
      const content = await stat(path);
      
      if(content.isDirectory()){
        const subFiles = await readdir(path); 

        for(const subFile of subFiles){
          filePaths.push(`${path}\\${subFile}`)
        }
      }

      if(content.isFile()){
        filePaths.push(path);
      }
    }catch(_){
      errorPaths.push(path)
    }
  }

  return { filePaths, errorPaths }
}
