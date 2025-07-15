import React from "react";
import { Link } from "react-router-dom";

const socials = [
  {
    href: "https://x.com/TheMj0ln1r/",
    alt: "twitter",
    img: "https://themj0ln1r.github.io/social_icons/twitter.svg",
  },
  {
    href: "https://linkedin.com/in/mj0ln1r/",
    alt: "linkedin",
    img: "https://themj0ln1r.github.io/social_icons/linkedin.svg",
  },
  {
    href: "https://github.com/TheMj0ln1r/",
    alt: "github",
    img: "https://themj0ln1r.github.io/social_icons/github.svg",
  },
  {
    href: "mailto:playermj0ln1r@gmail.com",
    alt: "Email",
    img: "https://themj0ln1r.github.io/social_icons/email.svg",
  },
];

const navLinks = [
  { href: "/posts", label: "/posts" },
  { href: "/writeups", label: "/writeups" },
  { href: "/projects", label: "/projects" },
  { href: "/contact", label: "/contact" },
  { href: "/tags", label: "/tags" },
];

const hackerGreen = "#39FF14";

const Home = () => {
  return (
    <div className="min-h-screen h-screen flex flex-col items-center justify-center bg-black text-neutral-100 font-mono">
      {/* Custom style for selection and accent color */}
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
      <div className="content w-full max-w-6xl mx-auto flex flex-col min-h-screen px-2 sm:px-4 md:px-8">
        {/* Header */}
        <header className="w-full pt-8 pb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="main flex flex-col md:flex-row md:items-center gap-4">
            <a
              href="/"
              className="text-2xl sm:text-3xl font-bold hacker-underline hover:text-[--hacker-green] transition-colors"
            >
              Charan Nomula
            </a>
            <div className="socials flex gap-2 md:ml-6">
              {socials.map((s) => (
                <a
                  key={s.href}
                  className="social inline-block hover:scale-110 transition-transform"
                  href={s.href}
                  rel="me noreferrer"
                  target="_blank"
                >
                  <img src={s.img} alt={s.alt} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <nav className="mt-4 md:mt-0 flex flex-wrap items-center gap-2 text-base sm:text-lg">
            {navLinks.map((link, idx) => (
              <a
                key={link.href}
                href={link.href}
                className="hacker-underline hover:text-[--hacker-green] transition-colors"
                style={{ marginLeft: idx === 0 ? 0 : ".5em" }}
              >
                {link.label}
              </a>
            ))}
            <span className="mx-2 text-[--hacker-green]">|</span>
            <button
              aria-label="Toggle dark mode"
              className="ml-2 p-1 rounded hover:bg-neutral-900 transition-colors"
            >
              <img
                src="https://themj0ln1r.github.io/feather/sun.svg"
                alt="Light"
                className="w-5 h-5 inline-block dark:hidden"
              />
              <img
                src="https://themj0ln1r.github.io/feather/moon.svg"
                alt="Dark"
                className="w-5 h-5 hidden dark:inline-block"
              />
            </button>
          </nav>
        </header>
        {/* Main Content */}
        <main className="flex-1 w-full flex flex-col items-center justify-center py-4 sm:py-8">
          <article className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
            <section className="body">
              <div className="page-header text-3xl sm:text-4xl md:text-5xl font-bold mb-6 flex items-center gap-2">
                Charan Nomula
                <span
                  className="primary-color"
                  style={{ fontSize: "1.6em", color: hackerGreen }}
                >
                  .
                </span>
              </div>
              <p className="text-base sm:text-lg md:text-xl mb-2">
                Hello anon, this is Charan Nomula aka{" "}
                <span className="font-bold">MJ0LN1R</span> or{" "}
                <span className="font-bold">THEMJ0LN1R</span>.
              </p>
              <p className="text-base sm:text-lg md:text-xl mb-4">I am a __</p>
              <ul className="list-disc pl-6 sm:pl-8 space-y-2">
                <li>
                  <p className="text-base sm:text-lg">CTF Player</p>
                </li>
                <li>
                  <p className="text-base sm:text-lg">
                    Senior Blockchain Engineer{" "}
                    <a
                      href="https://x.com/SUPRA_Labs"
                      className="hacker-underline hover:text-[--hacker-green] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @Supra
                    </a>
                  </p>
                  <ul className="list-disc pl-6 sm:pl-8 mt-1 space-y-1 text-sm sm:text-base">
                    <li>Interoperability Solutions</li>
                    <li>Light clients</li>
                    <li>Consensus</li>
                    <li>Smart contracts</li>
                    <li>On-Chain Algorithms</li>
                  </ul>
                </li>
                <li>
                  <p className="text-base sm:text-lg">Security Researcher</p>
                </li>
                <li>
                  <p className="text-base sm:text-lg">
                    Blind Fold Programmer of {"{"}
                    <code className="mx-1 px-2 py-1 hacker-code rounded text-base">
                      .rs
                    </code>
                    ,
                    <code className="mx-1 px-2 py-1 hacker-code rounded text-base">
                      .sol
                    </code>
                    ,
                    <code className="mx-1 px-2 py-1 hacker-code rounded text-base">
                      .move
                    </code>
                    ,
                    <code className="mx-1 px-2 py-1 hacker-code rounded text-base">
                      .huff
                    </code>
                    ,
                    <code className="mx-1 px-2 py-1 hacker-code rounded text-base">
                      .py
                    </code>
                    ,
                    <code className="mx-1 px-2 py-1 hacker-code rounded text-base">
                      .sh
                    </code>
                    ,
                    <code className="mx-1 px-2 py-1 hacker-code rounded text-base">
                      .js
                    </code>
                    {"}"}
                  </p>
                </li>
                <li>
                  <p className="text-base sm:text-lg">
                    Trail By Fire Programmer of {"{"}
                    <code className="mx-1 px-2 py-1 hacker-code rounded text-base">
                      .*
                    </code>
                    {"}"}
                  </p>
                </li>
              </ul>
            </section>
          </article>
        </main>
      </div>
    </div>
  );
};

export default Home;
