import { FunctionalComponent } from "vue"
import { MetaResult } from "./metas-type"
import { Tags } from "./tags"

export type SourceSelectProps = {
  currentDir: string,
  addSourceDir : (sourcePath: string[]) => void,
  updateMetaResults : (paths ?: string[]) => { 
    error: { name: string, pathErrors: string[]}, 
    result: MetaResult[]
  } 
}

export type RoutePath = (path: 'home' | 'dashboard' | 'config') => void

export type NotificationLayoutProps = { 
  title ?: string, 
  content ?: any,
  firstButton ?: { label: string, fnAction: () => void },
  secondButton ?: { label: string, fnAction: () => void },
  closeModal ?: () => void
}

export type ProvideNotification = (options : NotificationLayoutProps) => void;

export type FieldTagStatus =  "EDITED" | "GENERATED" | "DEFAULT";

export type FieldValue ={
  tagValue: string, 
  status : FieldTagStatus
}

export type InputProps = {
  [tag in keyof Tags]: FieldValue
}

export type IndexPathTags <T> = { [path : string] : { [tag in keyof Tags]: T }};

export type InputDataProps = {
  tag: keyof Tags, 
  status: FieldTagStatus | FieldTagStatus[],
  value: string, 
  icon : FunctionalComponent<any>
}[]
