"use client";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  ExternalLink,
  Search,
  LogOut,
  Bookmark,
  X,
} from "lucide-react";

const BOOKMARK_COLORS = [
  "from-[#ff9a9e] to-[#fecfef]", // Soft pink gradient
  "from-[#a8edea] to-[#fed6e3]", // Aqua to pink
  "from-[#ffecd2] to-[#fcb69f]", // Peach gradient
  "from-[#d299c2] to-[#fef9d7]", // Purple to cream
  "from-[#fbc2eb] to-[#a6c1ee]", // Pink to blue
  "from-[#fdcbf1] to-[#e6dee9]", // Light pink to lavender
  "from-[#a1c4fd] to-[#c2e9fb]", // Sky blue gradient
  "from-[#ffeaa7] to-[#fdcb6e]", // Warm yellow
  "from-[#fab1a0] to-[#ff7675]", // Coral gradient
  "from-[#81ecec] to-[#74b9ff]", // Turquoise to blue
  "from-[#a29bfe] to-[#dfe6e9]", // Lavender to gray
  "from-[#fd79a8] to-[#fdcb6e]", // Pink to yellow
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const broadcastRef = useRef(null);
  const tabIdRef = useRef(null);

  const postBroadcast = (message) => {
    try {
      broadcastRef.current?.postMessage(message);
    } catch (error) {
      console.warn("BroadcastChannel postMessage failed:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
        return;
      }
      setUser(session.user);
      fetchBookmarks(session.user.id);
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.id]);

  const getDisplayName = (authUser) => {
    const meta = authUser?.user_metadata || {};
    const nameCandidate =
      meta.full_name ||
      meta.name ||
      meta.user_name ||
      meta.preferred_username ||
      meta.nickname ||
      authUser?.identities?.[0]?.identity_data?.full_name ||
      authUser?.identities?.[0]?.identity_data?.name;

    if (typeof nameCandidate === "string" && nameCandidate.trim()) {
      return nameCandidate.trim();
    }

    const email = authUser?.email;
    if (typeof email === "string" && email.includes("@")) {
      return email.split("@")[0];
    }

    return "";
  };

  const getAvatarUrl = (authUser) => {
    const meta = authUser?.user_metadata || {};
    const candidate =
      meta.avatar_url ||
      meta.picture ||
      meta.avatar ||
      authUser?.identities?.[0]?.identity_data?.avatar_url ||
      authUser?.identities?.[0]?.identity_data?.picture;
    return typeof candidate === "string" && candidate.trim() ? candidate.trim() : "";
  };

  const getInitials = (value) => {
    if (!value) return "U";
    const parts = String(value)
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  useEffect(() => {
    tabIdRef.current =
      tabIdRef.current ||
      (globalThis.crypto?.randomUUID?.() ??
        `tab-${Date.now()}-${Math.random()}`);

    if (typeof window === "undefined") return;
    if (typeof window.BroadcastChannel === "undefined") {
      console.warn(
        "BroadcastChannel not supported in this browser; multi-tab sync disabled",
      );
      return;
    }

    const channel = new BroadcastChannel("smart-bookmarks");
    broadcastRef.current = channel;

    channel.onmessage = (event) => {
      const message = event?.data;
      if (!message || typeof message !== "object") return;
      if (message.tabId && message.tabId === tabIdRef.current) return;

      if (!user?.id || message.userId !== user.id) return;

      if (message.type === "bookmark_add_optimistic") {
        const incoming = message.bookmark;
        if (!incoming) return;
        setBookmarks((current) => {
          if (
            current.some(
              (b) =>
                b.client_mutation_id &&
                b.client_mutation_id === incoming.client_mutation_id,
            )
          ) {
            return current;
          }
          if (current.some((b) => b.id === incoming.id)) {
            return current;
          }
          return [incoming, ...current];
        });
      }

      if (message.type === "bookmark_add_confirmed") {
        const incoming = message.bookmark;
        if (!incoming) return;
        const mutationId = message.mutationId;
        setBookmarks((current) => {
          const withoutOptimistic = mutationId
            ? current.filter((b) => b.client_mutation_id !== mutationId)
            : current;
          if (withoutOptimistic.some((b) => b.id === incoming.id))
            return withoutOptimistic;
          return [incoming, ...withoutOptimistic];
        });
      }

      if (message.type === "bookmark_add_failed") {
        const mutationId = message.mutationId;
        if (!mutationId) return;
        setBookmarks((current) =>
          current.filter((b) => b.client_mutation_id !== mutationId),
        );
      }

      if (message.type === "bookmark_delete") {
        const id = message.id;
        if (!id) return;
        setBookmarks((current) => current.filter((b) => b.id !== id));
      }

      if (message.type === "bookmark_delete_rollback") {
        const bookmark = message.bookmark;
        if (!bookmark) return;
        setBookmarks((current) => {
          if (current.some((b) => b.id === bookmark.id)) return current;
          return [bookmark, ...current];
        });
      }
    };

    return () => {
      try {
        channel.close();
      } catch {
        // ignore
      }
      if (broadcastRef.current === channel) broadcastRef.current = null;
    };
  }, [user]);

  const fetchBookmarks = async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookmarks:", error);
    } else {
      setBookmarks(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const channel = supabase
      .channel("bookmarks-channel", {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((current) => {
            if (current.some((b) => b.id === payload.new.id)) {
              return current;
            }
            return [payload.new, ...current];
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((current) => {
            const filtered = current.filter((b) => b.id !== payload.old.id);
            return filtered;
          });
        },
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("❌ Realtime subscription error:", err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    if (!user) return;

    setAdding(true);

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    const trimmedTitle = title.trim();
    const mutationId =
      globalThis.crypto?.randomUUID?.() ?? `mut-${Date.now()}-${Math.random()}`;
    const optimisticId = `optimistic-${mutationId}`;
    const optimisticBookmark = {
      id: optimisticId,
      user_id: user.id,
      title: trimmedTitle,
      url: finalUrl,
      created_at: new Date().toISOString(),
      client_mutation_id: mutationId,
    };

    setBookmarks((current) => [optimisticBookmark, ...current]);
    postBroadcast({
      type: "bookmark_add_optimistic",
      tabId: tabIdRef.current,
      userId: user.id,
      mutationId,
      bookmark: optimisticBookmark,
    });

    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .insert([{ user_id: user.id, title: trimmedTitle, url: finalUrl }])
        .select()
        .single();

      if (error) throw error;

      postBroadcast({
        type: "bookmark_add_confirmed",
        tabId: tabIdRef.current,
        userId: user.id,
        mutationId,
        bookmark: data,
      });

      setBookmarks((current) => {
        const withoutOptimistic = current.filter((b) => b.id !== optimisticId);
        if (withoutOptimistic.some((b) => b.id === data.id))
          return withoutOptimistic;
        return [data, ...withoutOptimistic];
      });

      setTitle("");
      setUrl("");
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding bookmark:", error);
      setBookmarks((current) => current.filter((b) => b.id !== optimisticId));
      postBroadcast({
        type: "bookmark_add_failed",
        tabId: tabIdRef.current,
        userId: user.id,
        mutationId,
      });
      alert("Error adding bookmark: " + (error?.message || "Unknown error"));
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteBookmark = async (id) => {
    const deletedBookmark = bookmarks.find((b) => b.id === id);
    const previousBookmarks = bookmarks;
    setBookmarks((current) => current.filter((b) => b.id !== id));
    postBroadcast({
      type: "bookmark_delete",
      tabId: tabIdRef.current,
      userId: user?.id,
      id,
    });

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting bookmark:", error);
      setBookmarks(previousBookmarks);
      if (deletedBookmark) {
        postBroadcast({
          type: "bookmark_delete_rollback",
          tabId: tabIdRef.current,
          userId: user?.id,
          bookmark: deletedBookmark,
        });
      }
      alert("Error deleting bookmark: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const formatBookmarkDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  };

  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBookmarkColor = (index) => {
    return BOOKMARK_COLORS[index % BOOKMARK_COLORS.length];
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4ff] via-[#fef5f8] to-[#fff9f0]">
        <div className="w-12 h-12 border-4 border-[#a29bfe]/20 border-t-[#a29bfe] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#fef5f8] to-[#fff9f0]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-white/70 border-b border-gray-200/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white" />
              </div>
              <span className="text-xl font-normal text-gray-900">my mind</span>
            </div>

            {/* Search and Add - Only show when scrolled */}
            <AnimatePresence>
              {scrolled && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4 flex-1 max-w-md mx-8"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search your mind..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white/80 border border-gray-200/50 rounded-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="p-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    title="Add bookmark"
                  >
                    <Plus size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/60 rounded-full border border-gray-200/50">
                <div
                  className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#a29bfe] to-[#6c5ce7] text-xs font-medium text-white"
                  title={getDisplayName(user) || user?.email || "User"}
                >
                  {!avatarError && getAvatarUrl(user) ? (
                    <img
                      src={getAvatarUrl(user)}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span>{getInitials(getDisplayName(user) || user?.email)}</span>
                  )}
                </div>
                <span className="text-sm text-gray-700 font-light hidden sm:block">
                  {getDisplayName(user) || user?.email?.split("@")[0]}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/60 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      >
        {/* Gradient Orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-200/40 via-purple-200/30 to-pink-200/20 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-7xl md:text-8xl lg:text-9xl font-serif font-light text-gray-900 mb-8 leading-tight"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Mindfully curated
            <br />
            <span className="italic">bookmarks</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center mt-12"
          >
            <div className="flex gap-1.5">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gray-400"
                  style={{
                    animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="relative bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Search Bar - Always visible in main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your bookmarks by title or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xl md:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              A collection of unique bookmarks for your digital life.
              <br />
              <span className="text-gray-500">Save them. Organize them. Make something beautiful.</span>
            </p>
            <p className="text-sm text-gray-400 mt-6 uppercase tracking-wider">
              Presented by <span className="font-medium text-gray-600">my mind</span>
            </p>
          </motion.div>

          {/* Add Bookmark Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mb-16"
          >
            <form onSubmit={handleAddBookmark} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
              <h3 className="text-lg font-light text-gray-700 mb-6">Save something new</h3>
              
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give it a name..."
                  className="w-full px-0 py-3 bg-transparent border-b border-gray-200 text-gray-900 text-lg placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  required
                  disabled={adding}
                />
                
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your link here..."
                  className="w-full px-0 py-3 bg-transparent border-b border-gray-200 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  required
                  disabled={adding}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={adding}
                  className="px-8 py-3 bg-black text-white rounded-full font-light hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {adding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Save to mind</span>
                      <Plus size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Bookmarks Grid */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light text-gray-700">
                Your collection{" "}
                <span className="text-gray-400">({filteredBookmarks.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-[#a29bfe]/20 border-t-[#a29bfe] rounded-full animate-spin"></div>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Bookmark className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-light text-gray-600 mb-2">
                  {searchQuery ? "No matching bookmarks found" : "Nothing here yet"}
                </h3>
                <p className="text-gray-500 font-light">
                  {searchQuery ? "Try a different search term" : "Start saving your favorite links above"}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredBookmarks.map((bookmark, index) => (
                    <motion.div
                      key={bookmark.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group relative"
                    >
                      <div
                        className={`h-72 rounded-2xl bg-gradient-to-br ${getBookmarkColor(
                          index
                        )} p-6 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
                      >
                        {/* Number Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="text-white/60 text-sm font-light">
                            N° {index + 1}
                          </span>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteBookmark(bookmark.id)}
                          className="absolute top-4 right-4 p-2 bg-black/10 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/20"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-white" />
                        </button>

                        {/* Content */}
                        <div className="flex-1 flex items-center justify-center">
                          <h3 className="text-white font-light text-2xl text-center line-clamp-4 px-4">
                            {bookmark.title}
                          </h3>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="text-white/70 text-xs font-light">
                            {formatBookmarkDate(bookmark.created_at)}
                          </div>

                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={16} className="text-white" />
                          </a>
                        </div>

                        {/* Syncing indicator */}
                        {String(bookmark.id).startsWith("optimistic-") && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Bookmark Modal - Kept for header button when scrolled */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => !adding && setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-gray-800">
                  Add a new bookmark
                </h2>
                <button
                  onClick={() => !adding && setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={adding}
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleAddBookmark} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-light">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give it a name..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
                    required
                    disabled={adding}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-light">
                    URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your link here..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
                    required
                    disabled={adding}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => !adding && setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-light hover:bg-gray-200 transition-colors"
                    disabled={adding}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-full font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {adding ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Save to mind</span>
                        <Plus size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}