<template>
  <div class="flex flex-col w-full font-medium overflow-y-hidden divide-base-dark-600">

    <div class="flex justify-between text-x1 mt-2.5 my-4">
      <div class="flex items-center gap-3">
        <div class="tracking-wider">Metadatas</div>
      </div>

      <div class="text-base-white-800">
        3 arquivos referentes
      </div>

    </div>
    <div v-if="metadatas.length" class="overflow-y-scroll h-full">
      <div
        class="flex gap-6 pr-4 mr-1 rounded-md relative justify-center py-1.5 my-1 text-x1 hover:bg-base-dark-500 cursor-pointer "
        v-for="[tag, value, generatedIcon] of metadatas" :key="tag">

        <div class="flex relative gap-1 items-center w-[35%]">
          <div :class="`absolute left-0 ml-3 py-2 w-1 rounded-full ${generatedIcon ? 'bg-green-600' : ''}`" />

          <p class="ml-8 text-base-white-600">{{ tag }}</p>
        </div>

        <div class="flex justify-between items-center w-full">
          <p class="">{{ value || "" }}</p>
          <div>
            <component :is="generatedIcon" class="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>


  </div>

  <MetadatasControllers />

</template>

<script setup>
import { WandSparkles, Edit, Tags } from "lucide-vue-next"

const metadatas = [
  ["artist", "text-exemple", WandSparkles],
  ["title", "text-exemple", WandSparkles],
  ["year", null],
  ["album", null],
  ["artist",],
  ["title", null],
  ["year",],
  ["album", "text-exemple", WandSparkles],
  ["artist",],
  ["title",],
  ["year",],
  ["album",],
  ["artist",],
  ["title",],
  ["year",],
  ["album",],
  ["artist",],
  ["title",],
  ["year",],
  ["album",],
  ["artist",],
  ["title",],
  ["year",],
  ["artist",],
  ["title",],
  ["year",],
  ["album",],
  ["artist",],
  ["title",],
  ["year",],
  ["album",],
  ["artist",],
  ["title",],
  ["year",],
]

</script>
