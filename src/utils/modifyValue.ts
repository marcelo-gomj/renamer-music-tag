import { flatten, flow, head, join, concat, __, tap } from "ramda";
import { mapIndexValues } from "./mapIndexes";
import { Patterns, TagValue } from "./types";
import { FieldTagStatus, FieldUniqueValue } from "@/types/vue/vue-types";
import { mergeIndexesAndValues } from "./addTag";

const setInputValueTag = (
  newValue: string,
  { tagValue }: FieldUniqueValue
) => (
  flow(
    tagValue,
    [
      (value: string) => mapIndexValues(value, head),
      flatten,
      join(';'),
      concat(__, ":" + newValue),
      (tagValue: string) => ({ tagValue, status: 'EDITED' as FieldTagStatus })   
    ]
  )
)

const extractInputValue = (
  input: string, 
  separator  = " "
) => flow(
  input, 
  [
    mapIndexValues,
    (patterns : Patterns) => mergeIndexesAndValues(patterns, separator)
  ]
)

export { setInputValueTag, extractInputValue };

