"use client";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 px-6 md:px-12 py-6 bg-white/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 text-xl">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-400" />
            <span className="font-medium text-gray-900">mymind</span>
            <span className="text-xs text-gray-400">®</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#" className="text-orange-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              What
            </a>
            <a href="#" className="text-yellow-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Why
            </a>
            <a href="#" className="text-pink-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              How
            </a>
            <a href="#" className="text-green-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              What's New
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/signin")}
              className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/signin")}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-medium transition-all shadow-lg shadow-orange-500/30"
            >
              Sign up
            </button>
          </div>
        </div>
      </motion.header>

      {/* Gradient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-orange-300/20 to-pink-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-5xl mx-auto mb-20"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-gray-900 mb-6 leading-[0.95]">
            Remember everything.
            <br />
            <span className="text-gray-500">Organize nothing.</span>
          </h1>
          
          <div className="mt-12 mb-8 flex flex-wrap items-center justify-center gap-3 text-lg md:text-xl text-gray-700">
            <span>All your</span>
          
            <span className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-pink-600 border border-pink-200 shadow-sm">
              bookmarks
            </span>
            <span className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-blue-600 border border-blue-200 shadow-sm">
              inspiration
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-lg md:text-xl text-gray-700 mb-12">
            <span>in one single, private place.</span>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/signin")}
            className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-lg font-medium transition-all shadow-xl shadow-orange-500/30 mb-16"
          >
            Get Started
          </motion.button>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-full mx-auto mb-0"
        >
          <div className="bg-[#ff6347] py-24 px-6 md:px-12 text-center">
            <p className="text-sm tracking-widest text-gray-900 mb-8 uppercase font-medium">
              NO WASTED TIME OR ENERGY
            </p>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-black mb-8 leading-tight max-w-5xl mx-auto">
              Folders are dead. This is your personal search engine.
            </h2>
            
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Search by color, keyword, brand, date – whatever you think of first. 
              Associative search & visual cues work with your brain to find it instantly.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Simple Footer Strip - Synced with page aesthetics */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-pink-400" />
              <span className="font-medium text-gray-900">mymind</span>
              <span className="text-xs text-gray-400">®</span>
              <span className="ml-2 text-gray-400">© 2026 All rights reserved</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}