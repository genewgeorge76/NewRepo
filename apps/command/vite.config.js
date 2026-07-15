import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only JARVIS bridge: mirrors api/jarvis.js so `npm run dev` on a desktop
// talks to the live Brain directly, without Vercel serverless functions.
const jarvisDevBridge = {
  name: 'jarvis-dev-bridge',
  configureServer(server) {
    server.middlewares.use('/api/jarvis', (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.setHeader('Content-Type', 'application/json')
        return res.end('{"error":"Method not allowed"}')
      }
      let body = ''
      req.on('data', (c) => { body += c })
      req.on('end', async () => {
        res.setHeader('Content-Type', 'application/json')
        try {
          const { message, history } = JSON.parse(body || '{}')
          const BRAIN_URL = process.env.BRAIN_API_URL || 'https://jworden-api.fly.dev'
          const cleanHistory = Array.isArray(history)
            ? history.slice(-20).map((m) => ({ role: m.role, content: String(m.content).slice(0, 800) }))
            : undefined
          const brainRes = await fetch(`${BRAIN_URL}/api/v1/public/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: String(message).slice(0, 800), history: cleanHistory, state_code: 'VA' })
          })
          const brain = await brainRes.json()
          res.end(JSON.stringify({ response: brain.message, toolCall: null }))
        } catch (e) {
          res.end(JSON.stringify({ response: `Brain link unavailable, Sir (${e.message}).`, toolCall: null }))
        }
      })
    })
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jarvisDevBridge],
})
