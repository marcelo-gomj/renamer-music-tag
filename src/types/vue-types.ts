import { MetaResult } from "./metas-type"

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