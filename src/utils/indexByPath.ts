import * as R from "ramda";
import { mapIndexValues } from "./mapIndexes";
import { MetadataValues } from "@/types/metas-type";

const decodeMultiTags = (
  tagPatterns: MetadataValues,
  rawPatterns: string[]
) => {
  const indexedTagMap = R.reduce((
    acc, 
    [tag, { tagValue }]
  ) =>R.flow(
       mapIndexValues(tagValue, R.head),
      [
        R.flatten, 
        R.map( index => ([index, tag])), 
        R.fromPairs,
        R.mergeDeepRight(acc),
      ]
    )
  , {} as Record<string, string>,
    Object.entries(tagPatterns)
  )

  return rawPatterns.map((pattern, index) => {
    return indexedTagMap[index] || pattern;
  });
}

export { decodeMultiTags }