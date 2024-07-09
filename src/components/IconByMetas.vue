<template>
  <div>
    <component :is="Icon" :class="style.type" />
  </div>  
</template>

<script setup lang="ts">
import { CalendarIcon, Captions, Disc, Link2, LucideUsers, Music2, Tag } from 'lucide-vue-next';
import { MetasAsMethod } from 'src/types/metas-type';

  const { tag, style } = defineProps<{
    tag: { type: MetasAsMethod, default: null },
    style: { type: SVGStyleElement, default : "" }
  }>()


  console.log("TAG AQUI", tag)
const Icon = {
  "track" : Music2 ,
  "title" : Captions ,
  "album" : Disc ,
  "feat" : Link2 ,
  "artist" : LucideUsers,
  "disc" : Disc,
  "year":  CalendarIcon,
  "default" : Tag
}[tag.type]

</script>