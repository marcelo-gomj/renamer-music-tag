// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";
import { generateMetasByDir } from "./preload/meta-generator";
import { selectMusicsSources } from "./preload/select-musics-source";
import { editMusicMetadatas } from "./preload/services/node-id3";

export const api = {
  metas  : { generateMetasByDir },
  explorer : { selectMusicsSources },
  nodeID3 : { editMusicMetadatas }
}

contextBridge.exposeInMainWorld("api", api);

