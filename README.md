🧠 MyMind
<div align="center"> <h3>Save everything. Organize nothing.</h3> <p>A beautiful, real-time bookmark manager that actually understands how your brain works.</p>
<a href="https://smartbookmarkweb-xi.vercel.app/"><strong>🚀 Live Demo</strong></a> •
<a href="https://github.com/Mridulklra/Smartly"><strong>📦 GitHub</strong></a> •
<a href="https://www.loom.com/share/cf3c45069b284a379eca7895ba984f1d"><strong>🎥 Watch Demo</strong></a>

<br> <br>
https://img.shields.io/badge/JavaScript-98.8%2525-yellow
https://img.shields.io/badge/CSS-1.2%2525-blue
https://img.shields.io/badge/Next.js-16-black
https://img.shields.io/badge/Supabase-Realtime-green

</div>
⚡️ The Problem
Browser bookmarks are a mess. Folders don't work. You save links and never find them again.

💫 The Solution
No folders. No tags. No friction. Just save what matters and find it instantly.

What Makes MyMind Different
🎨 Visual Memory	Color-coded cards trigger faster recall than folder trees
⚡️ Instant Sync	Updates across tabs and devices in milliseconds
🔍 Smart Search	Find anything by title, URL, or just what you remember
🧠 Zero Organization	Your brain doesn't think in folders. Neither should your bookmarks.
🔐 Private by Design	Your data stays yours. Always.
🛠️ Tech Stack
<div align="center">
Frontend	Backend	Auth	Styling	Deployment
Next.js 16 + React 19	Supabase (PostgreSQL + Realtime)	Google OAuth	Tailwind CSS v4	Vercel
</div>
✨ Key Features
Real-time sync across all open tabs

Optimistic updates – see changes instantly, even on slow connections

Cross-device sync – save on desktop, open on phone

Chrome extension – one-click save from any webpage

Beautiful by default – intentionally designed animations

🚀 Quick Start (5 minutes)
Prerequisites
Node.js 20.9.0+

Supabase account (free tier works)

Installation
bash
# Clone the repository
git clone https://github.com/Mridulklra/Smartly.git
cd Smartly

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your Supabase credentials to .env.local

# Run the development server
npm run dev
Database Setup
Run this SQL in your Supabase SQL editor:

sql
-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create access policy
create policy "Users can manage their own bookmarks"
  on bookmarks for all
  using (auth.uid() = user_id);
Environment Variables
env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
📁 Project Structure
text
mymind/
├── app/                    # Next.js app router
│   ├── (auth)/             # Landing & sign-in pages
│   ├── dashboard/           # Main application
│   └── auth/callback/       # OAuth handler
├── chrome-extension/        # Browser extension
├── lib/                     # Supabase client
└── public/                  # Static assets
🌐 Deploy to Vercel
Push to GitHub

Import to Vercel

Add environment variables

Update Supabase redirect URL to https://yourdomain.com/auth/callback

🤝 Contributing
PRs are welcome! For major changes, please open an issue first.

Fork the repository

Create your feature branch (git checkout -b feature/amazing)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing)

Open a Pull Request

📄 License
MIT

<div align="center"> <h3>⭐ Star this repo if you found it useful! ⭐</h3> <p>Made with ☕ and 🎵 by Mridul</p>
<a href="https://smartbookmarkweb-xi.vercel.app/"><strong>🚀 Live Demo</strong></a> •
<a href="https://github.com/Mridulklra/Smartly"><strong>📦 GitHub</strong></a> •
<a href="https://www.loom.com/share/cf3c45069b284a379eca7895ba984f1d"><strong>🎥 Watch Video</strong></a>

</div>
