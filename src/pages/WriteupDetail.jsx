import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { writeups } from "../constants/writeups";

// Utility to create a slug from a string
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const WriteupDetail = () => {
  const { ctfSlug, challengeSlug } = useParams();
  const navigate = useNavigate();
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [error, setError] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Find the CTF event
  const ctf = writeups.find(
    (w) => slugify(w.title) === ctfSlug || slugify(w.name) === ctfSlug
  );
  const challenges = ctf?.CTFS || [];

  // Find the challenge
  let challenge = null;
  if (challenges.length > 0) {
    if (challengeSlug) {
      challenge = challenges.find(
        (ch) => slugify(ch.file.replace(/\.md$/, "")) === challengeSlug
      );
    } else {
      challenge = challenges[0];
    }
  }

  // If no challengeSlug, redirect to first challenge for direct linking
  useEffect(() => {
    if (ctf && challenges.length > 0 && !challengeSlug) {
      const firstSlug = slugify(challenges[0].file.replace(/\.md$/, ""));
      navigate(`/writeups/${ctfSlug}/${firstSlug}`, { replace: true });
    }
    // eslint-disable-next-line
  }, [ctfSlug, ctf, challengeSlug, challenges.length]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [ctfSlug, challengeSlug]);

  if (!ctf) {
    return <div className="text-red-400 p-4">CTF not found.</div>;
  }
  if (!challenge) {
    return <div className="text-red-400 p-4">Writeup not found.</div>;
  }

  const mdUrl = challenge.url;

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-mono">
      <style>{`
        :root {
          --hacker-green: #39FF14;
        }
        ::selection {
          background: #39FF14;
          color: #111;
        }
        .hacker-underline {
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-color: #39FF14;
        }

      
        @media (max-width: 768px) {
          .mobile-sidebar-backdrop {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6);
            z-index: 40;
          }
          .mobile-sidebar {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            width: 80vw;
            max-width: 320px;
            background: #18181b;
            border-right: 2px solid #23272e;
            z-index: 50;
            box-shadow: 4px 0 24px 0 rgba(0,0,0,0.18);
            padding: 2rem 1.2rem 1.2rem 1.2rem;
            display: flex;
            flex-direction: column;
            animation: slideInLeft 0.2s;
          }
          @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        }
      `}</style>

      {/* Header */}
      <header className="w-full pt-6 pb-4 px-4 sm:px-6 md:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-neutral-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-row items-center gap-3 sm:gap-4">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded hover:bg-neutral-900 transition-colors mr-2"
            aria-label="Open folder sidebar"
            onClick={() => setMobileSidebarOpen((v) => !v)}
          >
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link
            to="/"
            className="text-xl sm:text-2xl md:text-3xl font-bold hacker-underline hover:text-[--hacker-green] transition-colors duration-200"
          >
            Charan Nomula
          </Link>
        </div>
        <nav className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base md:text-lg">
          <div className="flex flex-wrap items-center gap-2">
            {["posts", "writeups", "projects", "contact", "tags"].map(
              (route) => (
                <React.Fragment key={route}>
                  <Link
                    to={`/${route}`}
                    className={`hacker-underline hover:text-[--hacker-green] transition-colors duration-200 whitespace-nowrap ${
                      route === "writeups"
                        ? "font-bold text-[--hacker-green]"
                        : ""
                    }`}
                  >
                    /{route}
                  </Link>
                  {route !== "tags" && (
                    <span className="mx-2 text-neutral-500">•</span>
                  )}
                </React.Fragment>
              )
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar (Drawer) */}
      {mobileSidebarOpen && (
        <>
          <div
            className="mobile-sidebar-backdrop"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <nav className="mobile-sidebar">
            <div
              className="font-bold text-[--hacker-green] mb-4 flex items-center gap-2 cursor-pointer"
              onClick={() => setIsFolderOpen(!isFolderOpen)}
            >
              <span className="text-lg">
                {isFolderOpen ? "📂" : "📁"} Writeups
              </span>
            </div>
            <ul className="text-sm space-y-2">
              {challenges.map((ch) => {
                const chSlug = slugify(ch.file.replace(/\.md$/, ""));
                return (
                  <li key={ch.file}>
                    <button
                      onClick={() => {
                        navigate(`/writeups/${ctfSlug}/${chSlug}`);
                        setMobileSidebarOpen(false);
                      }}
                      className={`block px-3 py-2 rounded-lg hacker-underline hover:bg-neutral-900 hover:text-[--hacker-green] transition-all duration-200 flex items-center gap-2 ${
                        challengeSlug === chSlug ||
                        (!challengeSlug && ch === challenges[0])
                          ? "bg-neutral-900/50 text-[--hacker-green] font-bold"
                          : ""
                      }`}
                    >
                      <span className="text-sm">📄</span>
                      {ch.file}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}

      {/* Layout */}
      <div className="relative flex flex-row gap-6 px-4 sm:px-6 md:px-8 w-full mx-auto md:py-8">
        {/* Left: Folder Structure */}
        <aside
          className="hidden md:flex flex-col w-64 min-w-[16rem] border-r border-neutral-800 pr-6"
          style={{
            position: "sticky",
            top: "96px",
            alignSelf: "flex-start",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <div
            className="font-bold text-[--hacker-green] mb-4 flex items-center gap-2 cursor-pointer hover:text-neutral-300 transition-colors"
            onClick={() => setIsFolderOpen(!isFolderOpen)}
          >
            <span className="text-lg">
              {isFolderOpen ? "📂" : "📁"} Writeups
            </span>
          </div>
          {isFolderOpen && (
            <ul className="text-sm space-y-2">
              {challenges.map((ch) => {
                const chSlug = slugify(ch.file.replace(/\.md$/, ""));
                return (
                  <li key={ch.file}>
                    <button
                      onClick={() => navigate(`/writeups/${ctfSlug}/${chSlug}`)}
                      className={`w-full text-left px-3 py-2 rounded-lg hacker-underline hover:bg-neutral-900 hover:text-[--hacker-green] transition-all duration-200 flex items-center gap-2 ${
                        challengeSlug === chSlug ||
                        (!challengeSlug && ch === challenges[0])
                          ? "bg-neutral-900/50 text-[--hacker-green] font-bold"
                          : ""
                      }`}
                    >
                      <span className="text-sm">📄</span>
                      {ch.file}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* Center: Markdown Content */}
        <main className="flex-1 min-w-0 ">
          <div className="bg-neutral-900/80 rounded-2xl shadow-2xl border border-neutral-800 max-w-7xl mx-auto">
            {error ? (
              <div className="text-red-400 p-4">Error: {error}</div>
            ) : (
              <MarkdownRenderer url={mdUrl} />
            )}
          </div>
        </main>

        {/* Right: Hashtags */}
        <aside
          className="hidden md:flex flex-col w-48 min-w-[12rem] border-l border-neutral-800 pl-6"
          style={{
            position: "sticky",
            top: "96px",
            alignSelf: "flex-start",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <div className="font-bold text-[--hacker-green] mb-4 flex items-center gap-2">
            <span className="text-lg">🏷️</span> #hashtags
          </div>
          <div className="flex flex-wrap gap-2">
            {(challenge.tags || []).map((tag) => (
              <span
                key={tag}
                className="bg-neutral-900 text-[--hacker-green] px-3 py-1 rounded-full text-xs font-mono hover:bg-neutral-800 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WriteupDetail;
