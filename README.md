🧠 MyMind - Intelligent Bookmark Manager

Save everything. Organize nothing. A beautiful, real-time bookmark manager that actually understands how your brain works.

<div align="center">
✨ Live Demo • 🎥 Watch Video
Show Image
Show Image
Show Image
Show Image
</div>

🎯 The Problem
Browser bookmarks are a mess. Folders don't work. Tags are tedious. You save hundreds of links and never find them again.
✨ The Solution
MyMind strips away the complexity. Just save what matters and find it instantly when you need it. No folders, no tags, no friction.
What Makes It Different
🎨 Visual Memory - Color-coded cards trigger recall faster than folder trees
⚡ Instant Sync - Updates across all tabs and devices in milliseconds
🔍 Smart Search - Find anything by title, URL, or just what you remember
🎭 Zero Organization - Your brain doesn't think in folders. Neither should your bookmarks.
🔐 Private by Design - Google login. Your data stays yours. Always.
🌊 Buttery Smooth - Animations that feel native, not janky

🚀 Features That Actually Matter
Real-Time Everything
Open 10 tabs? Changes in one appear instantly in all. No refresh. No lag. Just works.
Optimistic Updates
See your bookmark immediately. Even on slow connections. We handle the backend magic.
Cross-Device Sync
Save on desktop. Open on phone. It's already there.
Chrome Extension
One-click save from any webpage. No context switching.
Beautiful by Default
Every color, every animation, every transition - intentionally designed to feel premium.

🛠️ Tech Stack
Built with the best tools for modern web apps:
Frontend        → Next.js 16 (App Router) + React 19
Backend         → Supabase (PostgreSQL + Realtime)
Authentication  → Supabase Auth (Google OAuth)
Styling         → Tailwind CSS v4
Animations      → Framer Motion
State Sync      → BroadcastChannel API + Realtime subscriptions
Icons           → Lucide React
Deployment      → Vercel (Edge Network)

⚡ Quick Start
Prerequisites

Node.js 20.9.0+
Supabase account (free tier works)
5 minutes

Installation
1️⃣ Clone & Install
bashgit clone https://github.com/yourusername/mymind.git
cd mymind
npm install
2️⃣ Database Setup
Create a Supabase project, then run this SQL:
sql-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Users can only see their own bookmarks
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);
3️⃣ Environment Variables
Create .env.local:
bashNEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
4️⃣ Enable Google Auth

Supabase Dashboard → Authentication → Providers
Enable Google
Add redirect URL: http://localhost:3000/auth/callback

5️⃣ Run
bashnpm run dev
Open http://localhost:3000 🎉

🔌 Chrome Extension
Save bookmarks from any page in one click:

Open chrome-extension/popup.js
Add your Supabase credentials:

javascriptconst SUPABASE_URL = 'your_supabase_url';
const SUPABASE_ANON_KEY = 'your_anon_key';
const APP_URL = 'http://localhost:3000';
```
3. Load in Chrome:
   - Visit `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

---

## 📁 Project Architecture
```
mymind/
├── app/
│   ├── (auth)/
│   │   ├── page.js              # Landing page
│   │   └── signin/page.js       # Sign in
│   ├── dashboard/page.js        # Main app
│   ├── auth/callback/route.js   # OAuth handler
│   ├── globals.css
│   └── layout.js
├── chrome-extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── icons/
├── lib/
│   └── supabase.js              # Supabase client
└── public/
```

---

## 🚢 Deploy to Production

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

**Important:** Update Supabase redirect URL to your production domain:
```
https://yourdomain.com/auth/callback
Other Platforms
Works on any platform supporting Next.js:

Netlify
Railway
Render
Digital Ocean


🎨 Design Philosophy
Visual > Textual
Your brain remembers colors and layouts better than folder names.
Instant > Perfect
Show changes immediately. Handle errors gracefully. Never make users wait.
Simple > Feature-Rich
Every feature removed is a decision users don't have to make.
Beautiful > Functional
Both. Always both. No compromises.

🔧 Key Technical Highlights
Real-Time Multi-Tab Sync
javascript// BroadcastChannel + Supabase Realtime
// Changes propagate across all open tabs in <100ms
Optimistic Updates with Rollback
javascript// Show UI changes immediately
// Revert if server rejects
// Users never see loading spinners
Smart Color System
javascript// 12 gradient combinations
// Deterministic based on index
// Balanced across the spectrum

🤝 Contributing
Found a bug? Have an idea? PRs welcome!

Fork the repo
Create feature branch (git checkout -b feature/amazing)
Commit changes (git commit -m 'Add amazing feature')
Push (git push origin feature/amazing)
Open a Pull Request


📄 License
MIT License - Use it however you want!

🙏 Acknowledgments
Inspired by the original MyMind - proof that less is more.
Built with ☕ and 🎵 by Mridul

<div align="center">
Try It Now • Watch Demo
⭐ Star this repo if you found it useful!
</div>
