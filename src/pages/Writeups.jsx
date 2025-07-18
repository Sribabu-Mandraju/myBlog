import React, { useState } from "react";
import { Link } from "react-router-dom";
import { writeups } from "../constants/writeups";
const socials = [
  // You can add your own socials here if needed
];

const navLinks = [
  { href: "/posts", label: "/posts" },
  { href: "/writeups", label: "/writeups" },
  { href: "/projects", label: "/projects" },
  { href: "/contact", label: "/contact" },
  { href: "/tags", label: "/tags" },
];

const hackerGreen = "#39FF14";
const PAGE_SIZE = 5;

// Utility to create a slug from a string
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const Writeups = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(writeups.length / PAGE_SIZE);
  const paginated = writeups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        .hacker-underline:hover {
          color: #39FF14;
        }
        .hacker-code {
          background: #111;
          color: #39FF14;
          border: 1px solid #39FF14;
        }
      `}</style>

      <div className="content w-full max-w-7xl mx-auto flex flex-col min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <header className="w-full pt-4 sm:pt-6 md:pt-8 pb-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-0">
          <div className="main flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <a
              href="/"
              className="text-xl sm:text-2xl md:text-3xl font-bold hacker-underline hover:text-[--hacker-green] transition-colors"
            >
              Charan Nomula
            </a>
            {/* Socials removed for customization */}
          </div>

          <nav className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 text-sm sm:text-base md:text-lg">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              {navLinks.map((link, idx) => (
                <React.Fragment key={link.href}>
                  <a
                    href={link.href}
                    className={`hacker-underline hover:text-[--hacker-green] transition-colors whitespace-nowrap${
                      link.href === "/writeups"
                        ? " font-bold text-[--hacker-green]"
                        : ""
                    }`}
                  >
                    {link.label}
                  </a>
                  {idx < navLinks.length - 1 && (
                    <span className="mx-1 sm:mx-2 text-neutral-500">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <span className="mx-2 text-[--hacker-green] hidden sm:inline">
                |
              </span>
              <button
                aria-label="Toggle dark mode"
                className="p-1 rounded hover:bg-neutral-900 transition-colors"
              >
                <img
                  src="https://themj0ln1r.github.io/feather/sun.svg"
                  alt="Light"
                  className="w-4 h-4 sm:w-5 sm:h-5 inline-block dark:hidden"
                />
                <img
                  src="https://themj0ln1r.github.io/feather/moon.svg"
                  alt="Dark"
                  className="w-4 h-4 sm:w-5 sm:h-5 hidden dark:inline-block"
                />
              </button>
            </div>
          </nav>
        </header>

        {/* Page Header */}
        <div className="page-header text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 flex items-center gap-1 sm:gap-2 px-2 sm:px-0">
          <span className="break-words">CTF Writeups</span>
          <span
            className="primary-color flex-shrink-0"
            style={{ fontSize: "1.6em", color: hackerGreen }}
          >
            .
          </span>
        </div>

        {/* Writeups List */}
        <main className="flex-1 pb-8">
          <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
            <ul className="divide-y divide-neutral-800 border-t border-neutral-800">
              {paginated.map((w) => (
                <li
                  key={w.title}
                  className="list-item py-4 sm:py-6 px-2 sm:px-4 hover:bg-neutral-900/40 transition-colors duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:gap-6">
                    <time className="text-xs sm:text-sm md:text-base text-neutral-400 font-mono min-w-[80px] sm:min-w-[100px] flex-shrink-0 order-2 sm:order-1">
                      {w.date}
                    </time>
                    <div className="flex-1 order-1 sm:order-2">
                      <h1 className="title text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-tight">
                        <Link
                          to={`/writeups/${slugify(w.title)}`}
                          className="hacker-underline hover:text-[--hacker-green] transition-colors duration-200 break-words"
                        >
                          {w.title}
                        </Link>
                      </h1>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="pagination flex justify-center sm:justify-end mt-6 sm:mt-8 px-2 sm:px-4 gap-2">
              <button
                className="hacker-underline hover:text-[--hacker-green] px-3 sm:px-4 py-2 rounded transition-colors duration-200 text-sm sm:text-base inline-flex items-center gap-1 sm:gap-2 disabled:opacity-40"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <span aria-hidden="true" className="text-[--hacker-green]">
                  ←
                </span>
                <span>Previous</span>
              </button>
              <span className="px-2 text-xs sm:text-base text-neutral-400">
                Page {page} of {totalPages}
              </span>
              <button
                className="hacker-underline hover:text-[--hacker-green] px-3 sm:px-4 py-2 rounded transition-colors duration-200 text-sm sm:text-base inline-flex items-center gap-1 sm:gap-2 disabled:opacity-40"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <span>Next</span>
                <span aria-hidden="true" className="text-[--hacker-green]">
                  →
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Writeups;
