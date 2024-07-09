import { dialog, ipcRenderer } from "electron";

async function selectMusicsSources(){
  return await ipcRenderer.invoke("open-dialog");

}



export {
  selectMusicsSources
}
