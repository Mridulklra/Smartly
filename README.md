🧠 MyMind
Save everything. Organize nothing. A beautiful, real-time bookmark manager that actually understands how your brain works.

Live Demo · Chrome Extension

✨ The Problem
Browser bookmarks are a mess. Folders don't work. You save links and never find them again.

💡 The Solution
No folders. No tags. No friction. Just save what matters and find it instantly when you need it.

What Makes It Different
🎨 Visual Memory – Color-coded cards trigger faster recall than folder trees

⚡ Instant Sync – Updates across tabs and devices in milliseconds

🔍 Smart Search – Find anything by title, URL, or just what you remember

🎭 Zero Organization – Your brain doesn't think in folders. Neither should your bookmarks.

🔐 Private by Design – Your data stays yours. Always.

🛠️ Tech Stack
Frontend	Backend	Auth	Styling	Deployment
Next.js 16 + React 19	Supabase (PostgreSQL + Realtime)	Google OAuth	Tailwind CSS v4	Vercel
🚀 Key Features
Real-time sync across all open tabs

Optimistic updates – see changes instantly

Cross-device sync – save on desktop, open on phone

Chrome extension – one-click save from any page

Beautiful by default – intentionally designed animations

⚡ Quick Start (5 minutes)
Prerequisites
Node.js 20.9.0+

Supabase account (free tier)

Installation
bash
# Clone & install
git clone https://github.com/yourusername/mymind.git
cd mymind
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Supabase credentials

# Run
npm run dev
Database Setup
Run this SQL in your Supabase SQL editor:

sql
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now() not null
);

alter table bookmarks enable row level security;

create policy "Users can manage their own bookmarks"
  on bookmarks for all
  using (auth.uid() = user_id);
Environment Variables
text
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
📁 Project Structure
text
mymind/
├── app/                    # Next.js app router
│   ├── (auth)/             # Landing & sign-in pages
│   ├── dashboard/           # Main app
│   └── auth/callback/       # OAuth handler
├── chrome-extension/        # Browser extension
├── lib/                     # Supabase client
└── public/                  # Static assets
🚢 Deploy to Vercel
Push to GitHub

Import to Vercel

Add environment variables

Update Supabase redirect URL to https://yourdomain.com/auth/callback

🤝 Contributing
PRs welcome! Open an issue first for major changes.