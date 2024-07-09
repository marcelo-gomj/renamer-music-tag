<template>
  <div class="flex relative flex-col h-[100vh] overflow-y-hidden">
    <HeaderMain />

    <div class="flex p-3 gap-3 w-full h-full overflow-y-hidden">
      <div class="flex flex-col h-full px-3 w-[55%] overflow-y-hidden">
        <TagsGenerated />
        <FilesPatterns />
      </div>

      <div class="w-[45%]">
        <div class="flex flex-col h-full min-h- px-4 py-3 rounded-xl border-base-dark-700 border-[1.5px]">
          <MetadataSections />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Tags } from 'lucide-vue-next';
import HeaderMain from './components/HeaderMain.vue';
import TagsGenerated from './components/TagsGenerated.vue';
import FilesPatterns from './components/FilesPatterns.vue';
import MetadataSections from './components/MetadataSections.vue';
import MetadatasControllers from './components/MetadatasControllers.vue';
</script>
