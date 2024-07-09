<template>
  <div class="flex py-3 pb-4 items-center gap-20">
    <div class="flex text-x0.5 font-medium gap-6 ">
      <div class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center">
        <FileSearch class="w-[1rem] h-[1rem]" />
        <p>Arquivos</p>
      </div>
      <div class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center">
        <FolderSearch class="w-[1rem] h-[1rem]" />
        <p>Pastas</p>
      </div>
      <div class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center">
        <RefreshCcw class="w-[1rem] h-[1rem]" />
        <p>Atualizar</p>
      </div>
      <div class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center">
        <MoreHorizontal class="w-[1rem] h-[1rem]" />
        <p>Mais</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { FileSearch, FolderSearch, RefreshCcw, MoreHorizontal } from "lucide-vue-next";
</script>