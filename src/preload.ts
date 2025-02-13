// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";
// import { generateMetasByDir } from "./preload/meta-generator.old";
import { selectMusicsSources } from "./preload/select-musics-source";
import nodeID3 from "./preload/services/node-id3";
import { generateMetadatasByPaths } from "./preload/metadatas-generator";

export const api = {
  metas  : { generateMetadatasByPaths },
  explorer : { selectMusicsSources },
  nodeID3
}

contextBridge.exposeInMainWorld("api", api);