
export type SourceSelectProps = {
  currentDir: string,
  addSourceDir : (sourcePath: string[]) => void
}

export type RoutePath = (path: 'home' | 'dashboard' | 'config') => void