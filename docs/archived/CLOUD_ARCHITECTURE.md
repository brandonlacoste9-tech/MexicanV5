# ☁️ GLOBAL SWARM ARCHITECTURE (OJEA V5)

**Status:** DRAFT (Future Roadmap)
**Target:** Global Distributed Deployment
**Philosophy:** One Repo, Many Hives.

---

## 🏗️ THE MONOREPO STRUCTURE

To support global scale, we must separate concerns while sharing intelligence.

```
/
├── apps/                  # Deployable Applications
│   ├── web/               # The Frontend (React/Vite)
│   │   ├── Dockerfile
│   │   └── src/           # The User Interface (QC, BR, AR, MX)
│   └── api/               # The Backend (Node/Express)
│       ├── Dockerfile
│       └── src/           # The Core Logic & API Routes
│
├── services/              # Microservices (Specialized Compute)
│   └── cortex/            # The AI Brain (Python/FastAPI)
│       ├── Dockerfile
│       ├── api/           # The REST Interface (FastAPI)
│       └── vision/        # The Computer Vision Logic (Pillow/Numpy)
│
├── packages/              # Shared Code (The "Glue")
│   └── shared/
│       ├── config/        # factory.ts, feature-flags.ts
│       ├── types/         # Typescript Interfaces (Shared between Web & API)
│       └── i18n/          # Translation JSONs (Shared)
│
└── infra/                 # Infrastructure as Code
    ├── docker-compose.yml # For Local Development (Simulating Cloud)
    └── k8s/               # Kubernetes Manifests (Future Scale)
```

---

## 🚀 DEPLOYMENT STRATEGY

### 1. The Face (Web)

- **Service:** `apps/web`
- **Target:** **Vercel** (Global Edge Network)
- **Why:** Fastest load times for users in CDMX, Rio, Buenos Aires, and Mexico City. The CDN handles the traffic.

### 2. The Heart (API)

- **Service:** `apps/api`
- **Target:** **Render** or **Railway** (Node.js Container)
- **Why:** Persistent connections, WebSockets (for Chat), and Database connectivity. Centralized control.

### 3. The Brain (Cortex)

- **Service:** `services/cortex`
- **Target:** **Render** (Python Container) or **Modal.com** (GPU Serverless)
- **Why:** Heavy compute. Auto-scales based on image upload volume. If 1000 users upload at once, it spins up more clones.

### 4. The Memory (Database)

- **Service:** **Supabase** (PostgreSQL)
- **Region:** **TBD** (Likely US-East for central latency, or Multi-Region Read Replicas).

---

## 🛡️ THE MIGRATION PLAN (Operation Ascension)

1.  **Stop Development:** Freeze feature work.
2.  **Move Files:** Execute the directory restructure defined above.
3.  **Update Imports:** Fix `../../` paths to use `@ojea/shared` aliases.
4.  **Dockerize:** Verify `docker-compose up` spins up Web + API + Cortex locally.
5.  **Deploy:** Connect GitHub repo to Vercel/Render.

**This architecture guarantees that Ojea can scale to millions of users without collapsing.**
