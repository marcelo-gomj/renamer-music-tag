import { generateMetadatasByPaths } from './metadatas-generator';
// import { generateMetasByDir } from './meta-generator';

import { map, split } from "ramda"

(async () => {
  const data = await (
    generateMetadatasByPaths
  )([
  ])
  console.log(data.results[0])
})()


