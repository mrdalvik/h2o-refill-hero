export interface ChangelogVersion {
  version: string
  entries: string[]
}

export const CHANGELOG: ChangelogVersion[] = [
  {
    version: '0.1.36',
    entries: [
      '🆕 Beta-превью: деплой на /beta/, переключение Production/Beta в настройках разработчика',
    ],
  },
  {
    version: '0.1.35',
    entries: [
      '🆕 Добавлена кнопка «Что нового?» в настройках',
    ],
  },
]
