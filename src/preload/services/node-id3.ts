import NodeID3 from "node-id3";
import * as R from "ramda";
import { MetaResult } from "src/types/metas-type";
import { MetaKeys } from "../../types/metas-type";

const editMusicMetadatas = async ({ 
  metadatas, 
  path 
}: MetaResult) => {
  const {
    album, artist, 
    disc, year, 
    feat, title, track
  } = R.reduce(
    (accMetadatas, [ key, meta ]) => ({ ...accMetadatas, [key] : meta.value }), 
    {} as MetaKeys<string>, 
    R.toPairs(metadatas)
  )

  try{
    const isUpdated = await NodeID3.Promise.update({
      title,
      album,
      artist : feat,
      year,
      trackNumber: track,
      originalArtist: artist,
      partOfSet: disc, 
    }, path)

    return isUpdated ? path : null
  }catch(_){
    return null
  }
}

export {
  editMusicMetadatas
}