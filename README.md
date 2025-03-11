# Web Page Summarizer with Cloudflare AI 🌟

A fun and interactive web application that summarizes web pages using Cloudflare's AI capabilities. Built with Cloudflare Workers and styled with a playful cloud theme.

## 🚀 Features

- Summarize any webpage by entering its URL
- Powered by Cloudflare's AI (Llama 2)
- Real-time processing with loading indicator
- Mobile-responsive design
- Fun cloud-themed interface with Comic Sans styling

## 🛠️ Technology Stack

- Cloudflare Workers
- Cloudflare Browser Rendering
- Cloudflare AI (@cf/meta/llama-3.3-70b-instruct-fp8-fast)
- Vanilla JavaScript
- HTML/CSS

## 📦 Installation

1. Clone this repository
2. Install Wrangler CLI if you haven't already:
```bash
npm install -g wrangler
```
3. Configure your `wrangler.jsonc` w/ 
```jsonc
"ai": {
		"binding": "AI"
	},
	"browser": {
		"binding": "MYBROWSER"
	},
```
4. Deploy to Cloudflare
```bash
wrangler deploy
```
