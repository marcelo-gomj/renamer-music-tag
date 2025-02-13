import { GenTagKey } from "@/types/metas-type";
import { Tags } from "@/types/tags";

export function isNotPatternKey(tag: GenTagKey) : tag is keyof Tags {
  return !tag.startsWith('pattern-');
}