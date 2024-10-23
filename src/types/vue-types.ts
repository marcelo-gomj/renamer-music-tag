import { FunctionalComponent, h } from "vue"
import { GenMetadatasResult, GenTagKey } from "./metas-type"
import { Tags } from "./tags"

export type SourceSelectProps = {
  currentDir: string,
  addSourceDir: (sourcePath: string[]) => void,
  updateMetaResults: (paths?: string[]) => {
    error: { name: string, pathErrors: string[] },
    result: GenMetadatasResult[]
  }
}

export type RoutePath = (path: 'home' | 'dashboard' | 'config') => void

export type ModalGlobalLayoutProps = {
  title?: string,
  content: ReturnType<typeof h> | '',
  firstButton?: { label: string, fnAction: () => void },
  secondButton?: { label: string, fnAction: () => void },
  closeModal?: () => void
}

export type ProvideModalGlobal = (options: ModalGlobalLayoutProps) => void;
export type FieldTagStatus = "EDITED" | "GENERATED" | "DEFAULT";

export type FieldValue = {
  tagValue: string,
  status: FieldTagStatus[]
}

export type FieldUniqueValue = {
  tagValue: string,
  status: FieldTagStatus,
  patternIndex: number
}

export type InputProps = Map<keyof Tags, FieldValue>;

export type IndexPathTags<T> = { 
  [path: string]: { 
    [tag in keyof Tags]: T 
  } 
};

export type InputDataProps = {
  tag: keyof Tags,
  status: FieldTagStatus[],
  value: string,
  icon: FunctionalComponent<any>
}[]

export type GlobalNotificationsProps = {
  title: string,
  id: number,
  type: 'SUCCESS' | 'ERROR' | 'ALERT',
  context?: string,
  actionButton?: (id: number) => void,
};

export type SetNotificationFunction = (
  notificationsProps: GlobalNotificationsProps
) => void;


export type ReferencePathsPattern = {
  [path: string] : string
}

export type ReferencePatterns = {
  [pattern: string] : GenTagKey[]
}

export type ReducePatternsObject = {
  pathIndexedByPatterns : ReferencePathsPattern,
  patterns : ReferencePatterns
}

export type PatternList = ({ 
  tagName: GenTagKey | string,
  isTag : boolean,
  icon?: any,  
  label?: string 
})[] 

export type CurrentPatternReference = { patternKey: string, patternProps: PatternList }