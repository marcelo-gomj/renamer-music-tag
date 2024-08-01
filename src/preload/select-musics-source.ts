import { ipcRenderer, OpenDialogOptions } from "electron";

async function selectMusicsSources(
  selectOptions: OpenDialogOptions["properties"] 
) : Promise<string[]>{
  return await ipcRenderer.invoke("open-dialog", selectOptions);
}

export {
  selectMusicsSources
}
