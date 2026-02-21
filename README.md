# Full-Stack TypeScript Template

Built with Bun • Hono • Drizzle ORM • PostgreSQL • React • Turborepo

A production-ready full-stack TypeScript template featuring a Bun-powered API (Hono), Drizzle ORM with PostgreSQL, a React + Vite frontend, JWT authentication, and a scalable Turborepo monorepo structure.

---

## Stack

- Bun
- Hono
- Drizzle ORM
- PostgreSQL
- React + Vite
- Tailwind CSS
- TypeScript
- Turborepo
- shadcn/ui
- JWT authentication (access + refresh tokens)

---

## Project Structure

client/     → React frontend (Vite)  
server/     → Hono API  
shared/     → Shared types  

---

## Getting Started

### 1. Install dependencies

```zsh
bun install
```

### 2. Configure environment variables

Create:

```zsh
server/.env
```

Using:

```zsh
server/.env.example
```

Minimum required:

```zsh
DATABASE_URL=postgres://user:password@localhost:5432/dbname  
JWT_SECRET=generate-a-strong-random-string  
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Run development servers

```zsh
bun run dev
```

---

## Database

Generate migrations:
```zsh
bunx drizzle-kit generate
```

Run migrations:
```zsh
bunx drizzle-kit migrate
```

---

## Available Scripts

From project root:
```zsh
bun run dev  
bun run build  
bun run lint  
bun run type-check  
```
---

## Version Injection (Optional)

This template supports build-time version injection via `APP_VERSION`.

If `APP_VERSION` is not set, it defaults to:

dev

### Inject commit SHA during CI

echo "APP_VERSION=$(git rev-parse --short HEAD)" >> $GITHUB_ENV

### Inject during Fly build

```zsh
fly deploy \
  --build-arg APP_VERSION=$(git rev-parse --short HEAD)
```

---

## Production Notes

- Do not commit `.env`
- Set secrets via your hosting provider
- Use a strong `JWT_SECRET` (≥ 32 bytes)
- Use a secure PostgreSQL connection string

---

## License

MIT
