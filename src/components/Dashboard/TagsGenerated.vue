<template>
  <div class="mt-2 mb-1">
    <div class="">
      <h2 class="text-[0.8rem] text-base-white-700 font-[600]">Referência dos arquivos</h2>
    </div>

    <ul
      class="flex mt-3 gap-0.5 border-[1.5px] border-base-dark-900 p-2 flex-wrap rounded-lg text-[0.825rem] font-medium">
      <li v-for="{ tag, Icon } in tags" :key="tag"
        :class="`flex gap-3 ${!Icon ? 'px-4 bg-base-dark-400' : 'pl-4 pr-5 bg-base-dark-500 hover:bg-base-dark-600 cursor-pointer hover:opacity-100'} py-1.5 rounded-full justify-center items-center text-base-white-200 hover:text-white`">
        <component v-if="Icon" class='w-4 h-4 stroke-[2]' :is='Icon' />
        <p>{{ tag }}</p>
      </li>

      <div class="flex gap-3 w-full">
        <li class="bg-base-dark-500 hover:bg-base-dark-700 basis-40 py-2 rounded-full text-center cursor-pointer">abrir
          arquivos</li>
        <li class="bg-base-dark-500 hover:bg-base-dark-700 basis-40 py-2 rounded-full text-center cursor-pointer">abrir
          pastas</li>
      </div>
    </ul>

    <div
      :class="`flex gap-10 justify-end my-1 px-2 text-base-white-750 font-bold text-x0.5 ${!tags.length ? 'invisible' : ''}`">
      <div class="py-1 rounded-full hover:text-white cursor-pointer">Gerar novamente</div>
      <div class="py-1 rounded-full hover:text-white cursor-pointer">Outros padrões</div>
    </div>
  </div>
</template>

<script setup>
import { Users, Undo, Music4, Disc, ListOrdered, RefreshCcw } from "lucide-vue-next"

const tags = [

]

// const tags = [
//   { tag: 'track', Icon: ListOrdered },
//   { tag: '-', Icon: null },
//   { tag: 'title', Icon: Music4 },
//   { tag: '-', Icon: null },
//   { tag: 'artist', Icon: Users },
//   { tag: '-', Icon: null },
//   { tag: 'album', Icon: Disc },
//   { tag: '.mp3', Icon: null },
// ]

</script>
