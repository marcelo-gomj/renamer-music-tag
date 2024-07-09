<template>
  <div class="flex flex-col w-1/2 overflow-y-hidden h-full">
    <div class="flex font-medium justify-between text-x1 mt-2.5 my-4">
      <div class="flex items-center gap-3">
        <div class="tracking-wider">Metadatas</div>
      </div>

      <div class="text-base-white-800">
        3 arquivos referentes
      </div>
    </div>

    <div>
      <div v-for="{ tag, icon, value, status } of tags"
        class="flex group relative text-x1 items-center gap-4 pl-6 pr-2 py-1.5 my-1 rounded-md hover:bg-base-dark-400 cursor-pointer">

        <div :class="`absolute left-1 w-1 rounded-full h-4 ${status === 'GENERATED' ? 'bg-green-400' :
          status === 'EDITED' ? 'bg-base-white-400' : ''
          } shrink-0`" />
        <div class="flex gap-5 items-center w-24">
          <component class="w-4 h-4 text-base-white-700" :is="icon" />
          <div class="font-medium text-base-white-700 tracking-wide line-clamp-1">{{ tag }}</div>
        </div>

        <div class="flex justify-between items-center w-full">
          <div class="font-medium w-full">{{ value }}</div>

          <div class="h-full text-base-white-700 group-hover:text-white">
            <component class="w-[0.85rem] h-[0.85rem]" v-if="status === 'GENERATED'" :is="WandSparkles" />
            <component class="w-[0.85rem] h-[0.85rem]" v-if="status === 'EDITED'" :is="Edit" />
            <component class="w-[0.85rem] h-[0.85rem] group-hover:visible invisible" />
          </div>
        </div>
      </div>
    </div>

    <MetadatasControllers />
  </div>
</template>

<script setup lang="ts">
import ToolsMetadatas from './ToolsMetadatas.vue';
import MetadataSections from './MetadataSections.vue';
import MetadatasControllers from './MetadatasControllers.vue';
import { Calendar, Captions, Disc, Music2Icon, Tag, Users, WandSparkles, Edit } from 'lucide-vue-next';
import { FunctionalComponent, ref } from 'vue';
type TagProps = {
  tag: string,
  status: "EDITED" | "GENERATED" | "DEFAULT",
  value: string,
  icon: FunctionalComponent<any>,
}[];

const tags = ref<TagProps>([
  { tag: "track", icon: Music2Icon, status: 'GENERATED', value: "Váriados" },
  { tag: "title", icon: Captions, status: 'GENERATED', value: "Váriados" },
  { tag: "artist", icon: Users, status: 'GENERATED', value: "Jorge e Mateus" },
  { tag: "album", icon: Disc, status: 'EDITED', value: "A Hora é Agora" },
  { tag: "year", icon: Calendar, status: 'GENERATED', value: "2012" },
  // { tag: "feat", icon: Tag, status: 'DEFAULT', value: "" },
  // { tag: "album", icon: Tag, status: 'DEFAULT', value: "" },
  // { tag: "artist", icon: Tag, status: 'DEFAULT', value: "" },
  // { tag: "feat", icon: Tag, status: 'DEFAULT', value: "" },
  // { tag: "album", icon: Tag, status: 'DEFAULT', value: "" },
  // { tag: "artist", icon: Tag, status: 'DEFAULT', value: "" },
])

</script>
