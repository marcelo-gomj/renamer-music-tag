import * as R from "ramda";
import { mapIndexValues } from "./mapIndexes";
import { Pattern, Patterns, UpdatePatternProps } from "./types";

const posTagWithIndex = (
  [patterns, [ indexes, patternValue ]] : [Patterns, Pattern]
) => {
  const endPatternIndex = indexes[indexes.length - 1];

  return patterns.reduce(
    ( 
      updateAcumulator, 
      pattern, 
      index
    ) : UpdatePatternProps => {
      const { indexUpdate } = updateAcumulator;
      const [currentIndexes, value] = pattern;
      const endCurrentIndex = currentIndexes[currentIndexes.length - 1];
      const startCurrentIndex = currentIndexes[0];

      if(
        endPatternIndex > startCurrentIndex &&
        endPatternIndex < endCurrentIndex
      ){
        const indexesUpdated = [...currentIndexes, ...indexes]
        .sort((a, b) => (a - b));

        return {
          indexUpdate: index,
          patternMerged: [indexesUpdated, value + ' ' + patternValue],
        }
      }

      if(indexUpdate === undefined){
        if(endPatternIndex < startCurrentIndex){
          return { indexUpdate: index }
        }

        if((index + 1) === patterns.length){
          return {
            indexUpdate : index + 1
          } 
        }
      }


      return updateAcumulator
    }, 
    { } as UpdatePatternProps
  )
}

const tagInputIndexer = (
  [patterns, inputs] : [Patterns, Patterns]
) => {
  return R.reduce((acc, input) => {
      const { indexUpdate, patternMerged } = posTagWithIndex([acc, input]);
      const [indexes, patternValue] = input;

      return R.insert(
        indexUpdate, 
        patternMerged || [indexes, patternValue], 
        patternMerged ? R.remove(indexUpdate, 1, acc) : acc
      )
    },
    patterns, 
    inputs
  )
}

const mergeIndexesAndValues = (
  patterns: Patterns,
  separator ?: string
) => patterns.reduce((
  acumulator,
  [indexes, value],
  index
) => (
 ([
  acumulator, 
  `${separator ? '' : R.join(';', indexes) + ':'}${value}`
])
 .join( (index == 0 || separator) ? (separator || '') : '/')
), '')

const orderTagValueByIndex = (
  currentValue: string,
  updateValue: string,
) => R.flow(
  [currentValue, updateValue],
  [
    R.map(mapIndexValues),
    tagInputIndexer,
    mergeIndexesAndValues
  ]
);

export { orderTagValueByIndex, mergeIndexesAndValues }