import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://andificus.com'
  const appDir = path.join(process.cwd(), 'app')

  const urls: MetadataRoute.Sitemap = []

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      // ❌ Skip route groups like (auth)
      if (entry.name.startsWith('(')) continue
      // ❌ Skip API routes
      if (entry.name === 'api') continue

      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        walk(fullPath)
      }

      if (entry.isFile() && entry.name === 'page.tsx') {
        const route = dir
          .replace(appDir, '')
          .replace(/\\/g, '/')

        const urlPath = route === '' ? '/' : route

        urls.push({
          url: `${baseUrl}${urlPath}`,
          lastModified: new Date(),
        })
      }
    }
  }

  walk(appDir)
  return urls
}


