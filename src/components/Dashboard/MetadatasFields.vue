<template>
  <div v-if="metas" class="flex flex-col w-[45%] overflow-y-hidden h-full">
    <div class="flex font-medium justify-between text-x1 mt-2.5 my-4">
      <div class="flex items-center gap-3">
        <div class="tracking-wider">Metadatas</div>
      </div>

      <div class="text-base-white-800">
        {{ metas.length }} arquivos referentes
      </div>
    </div>

    <div>
      <div v-for="data of tags(metas[0].metadatas)"
        class="flex group relative text-x1 items-center gap-4 pl-6 pr-2 py-1.5 my-1 rounded-md hover:bg-base-dark-400 cursor-pointer">

        <div :class="`absolute left-1 w-1 rounded-full h-4 ${data.status === 'GENERATED' ? 'bg-green-400' :
          data.status === 'EDITED' ? 'bg-base-white-400' : '' } shrink-0`" />
        <div class="flex gap-5 items-center w-24">
          <component class="w-4 h-4 text-base-white-700" :is="data.icon" />
          <div class="font-medium text-base-white-700 tracking-wide line-clamp-1">{{ data.tag }}</div>
        </div>

        <div class="flex justify-between items-center w-full">
          <div class="font-medium w-full">{{ data.value }}</div>

          <div class="h-full text-base-white-700 group-hover:text-white">
            <component class="w-[0.85rem] h-[0.85rem]" v-if="data.status === 'GENERATED'" :is="WandSparkles" />
            <component class="w-[0.85rem] h-[0.85rem]" v-if="data.status === 'EDITED'" :is="Edit" />
            <component class="w-[0.85rem] h-[0.85rem] group-hover:visible invisible" />
          </div>
        </div>
      </div>
    </div>

    <MetadatasControllers />
  </div>
</template>

<script setup lang="ts">
import MetadatasControllers from './MetadatasControllers.vue';
import { Captions, Disc, Tag,  Music2, Link2, LucideUsers, CalendarIcon, Edit, WandSparkles } from 'lucide-vue-next';
import { FunctionalComponent, inject } from 'vue';
import { MetaResult, MetaObjectResult } from 'src/types/metas-type';
import { toPairs } from 'ramda';

const metas = inject<MetaResult[]>("referenceFiles");

type TagProps = {
  tag: string,
  status: "EDITED" | "GENERATED" | "DEFAULT",
  value: string,
  icon: FunctionalComponent<any>
}[];

const iconsByMetadatas = (tag : string) => ({
  "track" : Music2 ,
  "title" : Captions ,
  "album" : Disc ,
  "feat" : Link2 ,
  "artist" : LucideUsers,
  "disc" : Disc,
  "year":  CalendarIcon,
  "default" : Tag
}[tag || "default"]);

const tags = (metadatas: MetaObjectResult) : TagProps => 
  toPairs(metadatas)
  .map(([key, meta]) => ({
      tag: key,
      icon: iconsByMetadatas(key),
      status: "GENERATED",
      value: meta.value
  })
)

</script>
