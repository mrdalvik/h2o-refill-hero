# H2O: Refill Hero

A pixel-art web app for tracking daily water intake. Fill a vending machine with bottles every time you drink water!

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Testing

```bash
npm run test        # watch mode
npm run test:run    # single run
npm run test:coverage  # with coverage report
```

## How to Play

1. Tap the input panel on the vending machine
2. Enter the amount of water you drank in milliliters
3. Tap "Put on shelf" — a bottle appears in the machine
4. Reach your daily goal!

### Bottle Sizes

- Up to 200 ml — small bottle
- 201–500 ml — medium bottle
- 501–1000 ml — large bottle
- Over 1000 ml — split into multiple bottles (1000 ml + 500 ml)

### Bottle Popup

Tap any bottle to see when it was added and its volume. You can remove an incorrectly added bottle from the popup.

### Progress

The progress bar is styled like a vending machine delivery window. Fill it up by reaching your daily goal!

### Day Reset

Each new day, customers come to the machine, take the water, and the machine empties again.

## Settings

Open settings via the gear button below the numpad.

- **Daily goal** — Set your target in ml (100–10000). Presets: 1500, 2000, 2500, 3000.
- **Calculate** — Auto-calculate goal from weight and activity level (approximate values; always listen to your body).
- **Reminders** — Never, 3 times a day, or 5 times a day (between 8:00 and 22:00).
- **Appearance** — Time of day: Auto, Morning, Day, Evening, Night. Affects background, tree, and birds.
- **Language** — Russian, English, Chinese, Spanish, Hindi, Portuguese, Japanese, German, French.

## Background

- Pixelated asphalt ground
- Tree with rustling leaves
- Occasional flying birds
- All elements adapt to the selected time of day

## Dev Codes

Enter **1998** on the numpad and tap "Put on shelf" to open developer settings:

- Restart day (clear bottles, trigger customer animation)
- Send a test reminder notification

## Tech Stack

- **Vue 3** + TypeScript + Composition API
- **Pinia** — state management
- **Vue I18n** — internationalization (9 languages)
- **@pixelium/web-vue** — pixel-art UI
- **Vite** — build tool
- **Vitest** — unit testing
- **localStorage** — persistence (goal, locale, settings, history)

## Project Structure

```
src/
├── components/     # Vue components (VendingMachine, SettingsDialog, etc.)
├── composables/    # useTimeOfDay, useWaterReminder, useDayReset
├── stores/        # Pinia stores (water, history)
├── utils/         # bottles, waterGoal, reminder (tested)
├── i18n/          # Locale files (ru, en, zh, es, hi, pt, ja, de, fr)
└── types/         # TypeScript types
```

## License

Private project.
