import { generateMetasByDir } from "./meta-generator";

generateMetasByDir(['D:\\music']).then(data => {
  console.log(data)
})