import { ALL_METADATAS } from "@/components/constants/metadatas";
import { GenTagKey } from "@/types/metas-type";
import { Tags } from "@/types/tags";
import { reduce, includes, reduced, filter } from "ramda";

export function isNotPatternKey(tag: GenTagKey) : tag is keyof Tags {
  return !tag.startsWith('pattern-');
}

export const reOrderTagList = (groups : string[][]) => filter((tag) => (
  reduce((hasTag, group) => (
    includes(tag, group) ? reduced(true) : hasTag
  ), false, groups)
), [
  'trackNumber', 'title', 'artist', 'album',
  'year', 'genre', 'partOfSet', 'date',
  'publisher', 'copyright', 'performerInfo'
] as GenTagKey[])


export const isTag = (tag: string) => {
  return ALL_METADATAS[tag as keyof Tags] !== undefined;
}	