import { PartialRecord } from "ramda";

type fields = 'title' | 'artist' | 'album' | 'year' | 'genre';
export type Tags <T> = {[key in fields]?: T };
export type TagValue = { value: string }
export type TagsValues =  PartialRecord<fields, TagValue>;
export type Raw = string[];
export type Pattern = [number[], string];
export type Patterns = Pattern[]
export type UpdatePatternProps = { 
  indexUpdate : number, 
  patternMerged ?: [number[], string], 
}
export type PipeFallbackFunction =  ((array: Pattern) => unknown);