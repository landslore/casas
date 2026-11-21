import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { exec } from 'node:child_process'

function scraperApiPlugin() {
  return {
    name: 'scraper-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === 'POST' && req.url === '/api/scrape') {
          exec('python3 scripts/scraper.py', (err, stdout, stderr) => {
            if (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: stderr || err.message }))
              return
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, stdout, timestamp: new Date().toISOString() }))
          })
          return
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), scraperApiPlugin()],
})

