import { GenTagKey } from "@/types/metas-type";
import { 
  Music2, Captions, Disc,
  CalendarIcon, User, Tag, Users 
} from 'lucide-vue-next';

type MetadatasProps =  { [key in GenTagKey]?: { label: string, icon: typeof Music2 } }

export const METADATAS: MetadatasProps = {
  "trackNumber": { label: "Faixa", icon: Music2 },
  "title": { label: "Título", icon: Captions },
  "album": { label: "Álbum", icon: Disc },
  "artist": { label: "Artista", icon: User },
  "partOfSet": { label: "Volume do disco ", icon: Disc },
  "year": { label: 'Ano', icon: CalendarIcon },
  "genre": { label: 'Genêro', icon: Tag },
  "performerInfo": { label: 'Artistas', icon: Users }
}

export const ALL_METADATAS : MetadatasProps = {
  ...METADATAS,
  "copyright": { label: 'Copyright', icon: Tag },
  "composer": { label: 'Compositor', icon: Tag },
  "date": { label: 'Data', icon: Tag },
  "mood": { label: 'tag', icon: Tag },
  "publisher": { label: 'Publicador', icon: Tag },
}