<template>
  <div class="flex pb-3 items-center gap-20">
    <div class="flex text-x0.5 font-medium gap-8">
      <div class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center">
        <FileSearch class="w-[1.05rem] h-[1.05rem]" />
        <p>Arquivos</p>
      </div>
      <div class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center">
        <FolderSearch class="w-[1.05rem] h-[1.05rem]" />
        <p>Pastas</p>
      </div>
      <div class="flex opacity-60 hover:opacity-100 cursor-pointer gap-3 items-center">
        <RefreshCcw class="w-[1.05rem] h-[1.05rem]" />
        <p>Atualizar</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { FileSearch, FolderSearch, RefreshCcw } from "lucide-vue-next";
</script>