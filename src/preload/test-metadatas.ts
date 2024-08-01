import { editMusicMetadatas } from "./services/node-id3";


editMusicMetadatas({
  metadatas: {
    title : {value: "Artist"},
    album : { value: "Album" },
    artist : { value :"Artist"},
    feat: { value: "feat" },
    year : { value: '2012' },
    track : { value : '1' },
    disc : { value: '2' },  
  },
  patterns: ["jogsg"],
  path: "D:\\Música\\The Best of Rock\\014 - Guns N' Roses - November Rain.mp3"
})