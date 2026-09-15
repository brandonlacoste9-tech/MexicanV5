# 🚀 FINAL INSTALLATION GUIDE FOR ANTIGRAVITY

Complete step-by-step guide to deploy the Trinity System.

---

r

## 📋 Prerequisites

- ✅ Node.js 18+
- ✅ Python 3.11+
- ✅ Git
- ✅ DeepSeek API key OR Google API key
- ✅ Supabase project (optional, for data storage)

---

## 🎯 Quick Install (5 Minutes)

### Step 1: Clone and Navigate

```bash
# If you have the files locally
cd /path/to/ojea

# Create necessary directories if they don't exist
mkdir -p backend/ai
mkdir -p ojea-browser-automation
mkdir -p scripts
mkdir -p components/ui
mkdir -p hooks
mkdir -p lib
```

### Step 2: Install Node Dependencies

```bash
npm install
```

### Step 3: Install Python Dependencies

```bash
cd ojea-browser-automation
pip install -r requirements.txt
playwright install chromium
cd ..
```

### Step 4: Configure Environment

```bash
# Root .env
cp .env.example .env

# Edit .env and add:
# DEEPSEEK_API_KEY=your-key-here
# AI_MODEL=deepseek-chat

# Browser service .env
cd ojea-browser-automation
cp .env.example .env
# Add the same API key
cd ..
```

### Step 5: Start Services

```bash
# Terminal 1: Browser service
cd ojea-browser-automation
uvicorn ojea_automation_api:app --reload

# Terminal 2: Main app
npm run dev
```

### Step 6: Test Everything

```bash
# Terminal 3: Run tests
npx ts-node scripts/test-trinity.ts
```

---

## ✅ Expected Output

### Browser Service (Terminal 1)

```
============================================================
🐝 Ojea Browser Intelligence API
============================================================
✅ Service: Running
✅ Health: /health
✅ Trends: POST /api/v1/research/trends
✅ Competitor: POST /api/v1/research/competitor
✅ Jobs: POST /api/v1/jobs/trends
============================================================

INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Test Suite (Terminal 3)

```
🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝
🚀 OJEA TRINITY INTEGRATION TEST SUITE
🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝

📋 Testing components:
   🧠 Brain: Güey Orchestrator (DeepSeek/Gemini)
   🤲 Hands: Browser-Use Automation
   🎨 Soul: UI/UX Design System

...

✅ ALL TESTS PASSED!
🐝 Ojea Trinity is fully operational!
```

---

## 🐳 Docker Deployment (Alternative)

```bash
# Start everything with Docker
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🔧 Verify Installation

### Health Checks

```bash
# Browser service health
curl http://localhost:8000/health
# Should return: {"status":"fully_armed_and_operational",...}

# Main app
curl http://localhost:3000
# Should return HTML
```

### API Tests

```bash
# Test trends discovery
curl -X POST http://localhost:8000/api/v1/research/trends \
  -H "Content-Type: application/json" \
  -d '{"platform":"google","region":"cdmx"}'

# Test design validation
curl -X POST http://localhost:3000/api/validate-design \
  -H "Content-Type: application/json" \
  -d '{"component_code":"<Button>Submit</Button>"}'
```

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
lsof -i :8000
kill -9 <PID>
```

### Module Not Found

```bash
# Python
cd ojea-browser-automation
pip install -r requirements.txt

# Node
npm install
```

### Playwright Issues

```bash
playwright install chromium
playwright install-deps
```

### API Key Not Working

```bash
# Verify key is set
echo $DEEPSEEK_API_KEY

# Check .env file
cat ojea-browser-automation/.env
```

---

## 📚 Next Steps

1. ✅ Explore `/app/tendances` page
2. ✅ Create Mexico-compliant components
3. ✅ Add Güey to your features
4. ✅ Deploy to production

---

## 🎉 You're Done!

The Trinity System is operational:

- 🧠 Güey orchestrating with DeepSeek/Gemini
- 🤲 Browser automation discovering Mexico content
- 🎨 Design system enforcing Mexico Blue + Mexicano

**Build Mexico's digital sovereignty! 🇨🇦⚡**
