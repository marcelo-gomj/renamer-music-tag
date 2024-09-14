<template>
  <div class="flex relative justify-center items-center w-full h-full overflow-y-hidden">
    <div class="flex flex-col gap-6 w-[700px] h-full overflow-y-hidden">
      <div class="flex space-y-2 flex-col py-8">
        <div class="font-medium text-3xl text-base-white-200">Auto Renamer Music Tags</div>
        <p class="text-x2 font-medium text-base-white-600">Generate music metadados automatically</p>
      </div>

      <div class="flex justify-between">
        <div class="w-full">
          <ul class="space-y-4">
            <li
              v-for="[key, { Icon, title, action }] of toPairs(CONTROLLERS)"
              :key="key"
              class="flex items-center gap-5 opacity-65 hover:opacity-100 cursor-pointer"
              @click="action"
            >
              <component :is="Icon" class="size-8" />
              <p class="font-medium text-x3">{{  title }}</p>
            </li>
          </ul>
        </div>

        <div class="w-full space-y-6">
          <div class="text-x3 font-medium">Pastas recentes</div>
          <ul class="space-y-2">
            <li 
              v-for="file of filesRecents"
              class="flex items-center gap-4 text-x1.5 text-base-white-700 hover:text-white transition-colors duration-150 cursor-pointer"
            >
              <component :is="Folder" class="size-5"/>
              <span class="font-medium">{{ file }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OpenDialogOptions } from 'electron';
import { FileSearch, FolderSearch, Folder } from 'lucide-vue-next';
import { useRoute } from '../../stores/route';
import { cond, equals, ifElse, length, toPairs } from 'ramda';
import { useNotification } from '../../stores/notifications';
import { useMedatas } from '@/stores/metadatas';
const { selectMusicsSources } = window.api.explorer


const { route } = useRoute();
const { updateSource } = useMedatas();
const { notify, clearAll } = useNotification();
const selectSourceMode = async (mode: OpenDialogOptions["properties"]) => {
  const res = await selectMusicsSources(mode)

  if(length(res) === 0){
    notify({
      title: 'Fonte não adicionada',
      id: Date.now(),
      context: cond([
        [ equals('openFile'), _ => 'Nunhum arquivo foi selecionado'],
        [ equals('openDirectory'), _ => 'Pasta não selecionada ou está vazia']
      ])(mode[0]),
      type: 'ALERT'
    })
    return;
  }

  updateSource(res);
  clearAll();
  route('dashboard');
}

const openFolder = () => selectSourceMode(['openDirectory']);
const openFile = () =>  selectSourceMode(['openFile']);

const CONTROLLERS : { [key: string] : { title: string,  Icon: any, action: () => void }} = {
  "open-files" : { title: 'Abrir arquivos', Icon: FileSearch, action: openFile },
  "open-folders" : { title: 'Abrir pastas', Icon: FolderSearch, action: openFolder },
}



const filesRecents = [
  "D:/music/Paramore",
  "D:/music/Nirvana",
  "D:/DISC-3/Sublime",
  "D:/music/Paramore",
  "D:/music/Nirvana",

]
</script>