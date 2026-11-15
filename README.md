# REALM

A real-life RPG for turning learning goals into skills, quests and measurable progress.

## Stack
- Next.js App Router + TypeScript
- Supabase Auth + Postgres with Row Level Security
- Vercel hosting

## Current milestone
- Email/password registration and login
- Player profile and dashboard
- Skill journal
- Quest board foundation
- RuneScape-inspired XP curve and level display

## Security
Player progress is protected with RLS. Direct client writes to player XP are revoked. XP awards must be implemented through a trusted server-side game engine. Never expose a Supabase service-role key in browser code.

## Environment
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
