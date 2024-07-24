
export type SourceSelectProps = {
  currentDir: string,
  addSourceDir : (sourcePath: string[]) => void
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