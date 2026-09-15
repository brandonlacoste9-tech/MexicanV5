# ⚡ OJEA TRINITY - 5 MINUTE SETUP

## 🎯 What You're Installing

**The Trinity System:**

- 🧠 Ti‑Guy (Brain): AI orchestrator using DeepSeek/Gemini
- 🤲 Browser Automation (Hands): Mexico trend discovery
- 🎨 Design System (Soul): Mexico Blue + Mexicano enforcement

---

## 📋 Prerequisites

- Node.js 18+
- Python 3.11+
- DeepSeek API key OR Google API key

---

## 🚀 Setup Steps

### 1. Install Python Dependencies (2 minutes)

```bash
cd ojea-browser-automation
pip install -r requirements.txt
playwright install chromium
```

### 2. Configure API Keys (1 minute)

```bash
# In ojea-browser-automation/
cp .env.example .env
```

Edit `.env` and add ONE of these:

**Option A: DeepSeek V3 (Recommended)**

```bash
DEEPSEEK_API_KEY=your-key-here
AI_MODEL=deepseek-chat
```

**Option B: Gemini 2.0 Flash (Free)**

```bash
GOOGLE_API_KEY=your-key-here
AI_MODEL=gemini-2.0-flash-exp
```

---

## 3. Start Browser Service (30 seconds)

```bash
cd ojea-browser-automation
uvicorn ojea_automation_api:app --reload
```

You should see:

```
🐝 Ojea Browser Intelligence API
✅ Service: Running
✅ Health: /health
```

---

## 4. Test Everything (1 minute)

In a new terminal:

```bash
# From project root
npx ts-node scripts/test-trinity.ts
```

Expected output:

```
🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝
🚀 OJEA TRINITY INTEGRATION TEST SUITE
...
✅ ALL TESTS PASSED!
🐝 Ojea Trinity is fully operational!
```

---

## 🎨 Using Ti‑Guy in Your Code

### Example 1: Discover Mexico Trends

```typescript
import { searchTrendsTool } from "@/backend/ai/orchestrator";

const trends = await searchTrendsTool.execute({
  platform: "tiktok",
  region: "cdmx",
});

console.log(trends.trends);
```

### Example 2: Validate UI Design

```typescript
import { validateDesignTool } from "@/backend/ai/orchestrator";

const code = `<Button>Submit</Button>`;

const validation = await validateDesignTool.execute({
  component_code: code,
  component_type: "button",
});

if (!validation.compliant) {
  console.log(validation.suggestions);
}
```

---

## 🔧 API Keys - Where to Get Them

### DeepSeek V3 (Recommended)

1. Visit: https://platform.deepseek.com/
2. Sign up
3. Get API key from dashboard
4. Cost: $0.14 per 1M tokens (very cheap!)

### Gemini 2.0 Flash (Free Alternative)

1. Visit: https://ai.google.dev/
2. Sign up
3. Get API key
4. Free tier: Generous limits

---

## ✅ Verification Checklist

- [ ] Python dependencies installed
- [ ] Playwright chromium installed
- [ ] API key added to .env
- [ ] Browser service running on port 8000
- [ ] Health check returns 200: `curl http://localhost:8000/health`
- [ ] Test suite passes: `npx ts-node scripts/test-trinity.ts`

---

## 🆘 Troubleshooting

**Port 8000 already in use:**

```bash
lsof -i :8000
kill -9 <PID>
```

**Module not found:**

```bash
cd ojea-browser-automation
pip install -r requirements.txt
```

**Playwright not installed:**

```bash
playwright install chromium
```

**API key not working:**

```bash
# Check .env exists
cat ojea-browser-automation/.env
# Verify key is set
echo $DEEPSEEK_API_KEY  # or $GOOGLE_API_KEY
```

---

## 🎉 You're Ready!

The Trinity system is now operational. Ti‑Guy can:

- ✅ Discover trending Mexico content
- ✅ Analyze competitors with cultural scoring
- ✅ Validate UI for Mexico Blue + Mexicano compliance

Build Mexico's digital sovereignty! 🇨🇦⚡
