# DocuMind AI - AI-Powered Technical Documentation Generator

DocuMind AI is a production-quality, modern SaaS application built to index codebases, parse ZIP files, or scan circuit schematics, compiling them into interactive technical manual suites (READMEs, API references, structural flowcharts, and security review audits).

---

## 🚀 Key Features

- **AI Documentation Engine**: Automatically generates README files, API specifications, and database layouts.
- **Inline Comment Generator**: Injects commentary blocks into JS, TS, Python, Java, C++, and C# files.
- **Security & Quality Audits**: Rates codebase risk parameters, tracking performance delays and vulnerabilities.
- **Diagram Generator**: Employs Mermaid.js to draw flowcharts, ER diagrams, and sequence loops dynamically.
- **Interrogative Chatbot**: Chat directly with your parsed workspace codebases.
- **Client-Side Export**: Print layout views directly to PDF, or download raw Markdown and MS Word DOCX blobs.
- **Dual-Storage DB Resiliency**: Queries PostgreSQL using Prisma ORM. If DATABASE_URL is not set, it seamlessly activates a local JSON file compiler (`local_db.json`), requiring zero upfront databases setup.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, strict TypeScript)
- **Styling & Animation**: Tailwind CSS v3, Framer Motion
- **Database Layer**: PostgreSQL, Prisma ORM
- **Session Gateway**: NextAuth / Auth.js (supporting Credentials & Google OAuth)
- **Validation**: Zod schema validators

---

## 📂 Project Directory Structure

```
document/
├── prisma/
│   └── schema.prisma         # Prisma Schema models
├── public/
│   └── images/               # Shared visual assets
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root Providers binding
│   │   ├── page.tsx          # Marketing Landing page
│   │   ├── api/              # API Route Handlers
│   │   ├── auth/             # Sign-in & Sign-up views
│   │   └── dashboard/        # Dashboard interfaces
│   ├── components/
│   │   ├── ui/               # Primary Tailwind CSS primitives
│   │   └── shared/           # ThemeToggle, PageTransitions, MermaidRender
│   ├── lib/
│   │   ├── auth.ts           # NextAuth session configuration
│   │   ├── db.ts             # PostgreSQL/Local JSON fallback adapter
│   │   └── ai.ts             # OpenAI/Claude prompts & analyzers
│   └── types/
│       └── index.ts          # Shared TypeScript interfaces
├── package.json
└── tailwind.config.ts
```

---

## 💻 Local Quick Start

### 1. Stage environment templates
Copy the template configuration file:
```bash
cp .env.example .env
```

### 2. Run Database Migrations (Optional)
If PostgreSQL is configured in `.env`, run the migration compiler:
```bash
npx prisma migrate dev --name init
```
If DATABASE_URL is left blank, the application launches with a local JSON file database populated with sample projects, chats, and audits.

### 3. Run Dev Server
Launch the development compiler:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to view the landing page. Log in with the pre-seeded admin user details:
- **Email**: `demo@documind.ai`
- **Password**: `password`

---

## 🌐 Production Deployment

### Option A: Vercel (Recommended)
1. Push your repository to GitHub/GitLab.
2. Link the project inside your Vercel Dashboard.
3. Configure environmental keys (`DATABASE_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `OPENAI_API_KEY`).
4. Click **Deploy**. Vercel will build the Next.js target folder automatically.

### Option B: Docker Containers
1. Create a `Dockerfile` in the root:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --legacy-peer-deps
   COPY . .
   RUN npx prisma generate
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```
2. Build and launch:
   ```bash
   docker build -t documind-app .
   docker run -p 3000:3000 --env-file .env documind-app
   ```
