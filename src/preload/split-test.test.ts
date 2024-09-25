import { filter, forEach, map, split } from "ramda"


// const rgx = /(-|(?:(?:part|ft|feat)\.?.?\w*\s?\w*)|\(|\)|^\d+(?:\.\d+))/ig
//             track number -'-' -            feat        -
// const rgx = /((?:DISC|VOL).?.?\d+)|(?:-)|(?=(?=part|ft|feat|dj|ep)\.?\w+.+\w+?)|(\d+(?:\.\d+)?)|(?:(\(|\)|\[|\]))/ig;
// const rgx = /(?:(\(|\)|\[|\]))/ig;
const rgx =  /(?<=(feat|ft|part)\..?)(\w+(\s|_|-|.))+/ig
const splitter = (list: string[]) => filter(
  (part  => (!!part)), 
  map((string : string) => split(rgx, string), list)
);

splitter([]).forEach(d => {
  console.log(d)
})