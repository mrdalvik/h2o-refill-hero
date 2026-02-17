import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

function manifestVersionPlugin() {
  return {
    name: 'manifest-version',
    transformIndexHtml(html: string) {
      return html.replace(/__APP_VERSION__/g, pkg.version)
    },
    closeBundle() {
      const dir = resolve(fileURLToPath(import.meta.url), '..')
      const manifestPath = resolve(dir, 'public/manifest.webmanifest')
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
      manifest.version = pkg.version
      manifest.start_url = `./?v=${pkg.version}`
      const outPath = resolve(dir, 'dist/manifest.webmanifest')
      writeFileSync(outPath, JSON.stringify(manifest, null, 2))
    },
  }
}

export default defineConfig({
  base: '/h2o-refill-hero/',
  plugins: [vue(), manifestVersionPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/stores/**'],
      exclude: ['**/*.spec.ts', '**/types/**'],
    },
  },
})
