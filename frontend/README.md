Frontend scaffold for CopilotLab

Quick start

Install dependencies:

```bash
cd frontend
npm install
```

Run dev server:

```bash
npm run dev
```

Notes

- The UI calls `/api/users?search=...` by default. If no backend is available, the client falls back to a local sample dataset for development.
- This is a minimal scaffold. Tailwind, animations, and a modal can be added next.
