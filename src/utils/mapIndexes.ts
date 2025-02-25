import * as R from "ramda";
import { Pattern, Patterns, PipeFallbackFunction } from "./types";


const splitIndexes = (
  [indexes, value] : string[]
)  => ([
  R.split(';', indexes).map(Number), 
  value
]) as Pattern

export const mapIndexValues = (
  value: string,
  setByValue: PipeFallbackFunction = R.identity
) => R.flow(
  value, [
  R.split('/'),
  R.map(
    R.pipe(
      R.split(':'), 
      splitIndexes,
      setByValue
    )
  )
])