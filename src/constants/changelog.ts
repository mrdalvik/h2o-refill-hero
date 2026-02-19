export interface ChangelogVersion {
  version: string
  entries: string[]
}

export const CHANGELOG: ChangelogVersion[] = [
  {
    version: '0.1.36',
    entries: [
      '⚒️ Нативный мобильный опыт: отключено выделение текста и иконок, только тап',
    ],
  },
  {
    version: '0.1.35',
    entries: [
      '🆕 Добавлена кнопка «Что нового?» в настройках',
    ],
  },
]
