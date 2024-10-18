import { GenTagKey } from "@/types/metas-type";
import { 
  Music2, Captions, Disc, ChevronDown,
  CalendarIcon, User, Tag, TrashIcon, 
  Undo2, Users, Grid2X2 
} from 'lucide-vue-next';

export const METADATAS: { [key in GenTagKey]?: { label: string, icon: typeof Music2 } } = {
  "trackNumber": { label: "Faixa", icon: Music2 },
  "title": { label: "Título", icon: Captions },
  "album": { label: "Álbum", icon: Disc },
  "artist": { label: "Artista", icon: User },
  "partOfSet": { label: "Volume do disco ", icon: Disc },
  "year": { label: 'Ano', icon: CalendarIcon },
  "genre": { label: 'Genêro', icon: Tag },
  "performerInfo": { label: 'Artistas', icon: Users }
}
