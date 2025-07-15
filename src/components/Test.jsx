import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "github-markdown-css/github-markdown.css";

function CodeBlock({ className, children }) {
  const [copied, setCopied] = React.useState(false);
  const language = className ? className.replace("language-", "") : "";
  const isShell = /^(shell|bash|zsh|sh|console|terminal|cmd|powershell)$/i.test(language);

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  if (isShell) {
    return (
      <div
        style={{
          position: "relative",
          margin: "1.5em 0",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
          border: "1.5px solid #23272e",
          background: "#18181b",
          overflow: "hidden",
          fontSize: "1em",
        }}
      >
        {/* Terminal header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#23272e",
            borderBottom: "1px solid #23272e",
            padding: "0.4em 1em 0.4em 0.9em",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            fontSize: "0.95em",
            color: "#a3a3a3",
            fontWeight: 500,
            letterSpacing: "0.04em",
            userSelect: "none",
          }}
        >
          <span style={{ display: "inline-block", width: 8, height: 8, background: "#ef4444", borderRadius: "50%", marginRight: 6 }} />
          <span style={{ display: "inline-block", width: 8, height: 8, background: "#f59e42", borderRadius: "50%", marginRight: 6 }} />
          <span style={{ display: "inline-block", width: 8, height: 8, background: "#22c55e", borderRadius: "50%", marginRight: 12 }} />
          <span style={{ fontSize: "0.93em", color: "#39FF14" }}>Terminal</span>
        </div>
        {/* Copy button */}
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy to clipboard"}
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            zIndex: 2,
            fontSize: "0.85em",
            padding: "2px 12px",
            borderRadius: "6px",
            border: "none",
            background: copied ? "#22c55e" : "#374151",
            color: "#fff",
            cursor: "pointer",
            boxShadow: copied ? "0 0 0 2px #22c55e55" : "none",
            transition: "background 0.2s, box-shadow 0.2s",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <div style={{ padding: "1.5em 1em 1em 1em", fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: "1.1em", color: "#39FF14", background: "none" }}>
          <pre style={{ margin: 0, background: "none", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {String(children).replace(/\n$/, "")}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        margin: "1.5em 0",
        borderRadius: "10px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        border: "1px solid #e5e7eb",
        background: "#23272e",
        overflow: "hidden",
        fontSize: "1em",
      }}
    >
      {language && (
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            background: "#1e2228",
            color: "#fff",
            fontSize: "0.75em",
            fontWeight: 600,
            padding: "2px 12px 2px 10px",
            borderBottomRightRadius: "8px",
            zIndex: 2,
            letterSpacing: "0.04em",
            textTransform: "capitalize",
            opacity: 0.85,
          }}
        >
          {language}
        </span>
      )}
      <button
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy to clipboard"}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          fontSize: "0.85em",
          padding: "2px 12px",
          borderRadius: "6px",
          border: "none",
          background: copied ? "#22c55e" : "#374151",
          color: "#fff",
          cursor: "pointer",
          boxShadow: copied ? "0 0 0 2px #22c55e55" : "none",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <div style={{ padding: "1.5em 1em 1em 1em" }}>
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          PreTag="div"
          customStyle={{
            background: "none",
            margin: 0,
            fontSize: "1.25em", // or "1.5em" for even larger
            fontFamily:
              'Fira Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function rewriteImageUrls(markdown) {
  // Replace src="public/..." or src='public/...' with src="/..."
  let result = markdown.replace(
    /src=["']public[\\\/]([^"'>]+)["']/g,
    'src="/$1"'
  );
  // Replace src="../images/..." or src='./images/...' with src="/images/..."
  result = result.replace(
    /src=["']\.\.\/images[\\\/]([^"'>]+)["']/g,
    'src="/images/$1"'
  );
  result = result.replace(
    /src=["']\.\/images[\\\/]([^"'>]+)["']/g,
    'src="/images/$1"'
  );
  // Optionally, handle src="images/..." (relative to markdown file) as /images/...
  result = result.replace(
    /src=["']images[\\\/]([^"'>]+)["']/g,
    'src="/images/$1"'
  );
  return result;
}

function MarkdownRenderer({ url }) {
  const [content, setContent] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!url) {
      setError("No URL provided");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then((raw) => setContent(rewriteImageUrls(raw)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) return <div className="p-6 text-center text-neutral-400">Loading Markdown...</div>;
  if (error) return <div className="error p-6 text-center text-red-400 bg-neutral-900 rounded-xl border border-red-700">Error: {error}</div>;

  // Helper to resolve relative image URLs based on the markdown file URL
  function resolveImageUrl(src) {
    // If src is already absolute (starts with http/https/data:), return as is
    if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
    // If the markdown file is from GitHub raw, resolve relative to its directory
    try {
      const mdUrl = new URL(url);
      // Remove the filename from the URL path
      mdUrl.pathname = mdUrl.pathname.replace(/\/[^/]*$/, "/" + src.replace(/^\.?\/?/, ""));
      return mdUrl.toString();
    } catch {
      return src;
    }
  }

  return (
    <div
      className="markdown-body"
      style={{
        background: "rgba(24, 24, 27, 0.95)",
        borderRadius: "1.25rem",
        boxShadow: "0 4px 32px 0 rgba(0,0,0,0.18)",
        padding: "2.5rem 2rem",
        border: "1.5px solid #23272e",
        margin: "0 auto",
        maxWidth: "100%",
        minHeight: "300px",
        fontSize: "1.08em",
        wordBreak: "break-word",
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .markdown-body {
            padding: 1.2rem 0.5rem !important;
            font-size: 0.98em !important;
            border-radius: 0.7rem !important;
          }
          .markdown-body h1, .markdown-body h2, .markdown-body h3 {
            font-size: 1.1em !important;
            margin: 0.8em 0 0.5em 0 !important;
          }
          .markdown-body pre, .markdown-body code {
            font-size: 0.95em !important;
          }
          .markdown-body table {
            font-size: 0.95em !important;
          }
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            if (inline) {
              return (
                <code
                  className={className}
                  style={{
                    background: "#23272e",
                    color: "#39FF14",
                    borderRadius: "6px",
                    padding: "0.2em 0.5em",
                    fontSize: "1em",
                    wordBreak: "break-word",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          table({ children }) {
            return (
              <div style={{ overflowX: "auto", margin: "1.5em 0" }}>
                <table
                  style={{
                    width: "100%",
                    background: "#18181b",
                    borderRadius: "0.75rem",
                    border: "1px solid #23272e",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    fontSize: "inherit",
                  }}
                >
                  {children}
                </table>
              </div>
            );
          },
          h1({ children }) {
            return <h1 style={{ color: "#39FF14", fontWeight: 700, fontSize: "2.2em", margin: "1.2em 0 0.7em 0", lineHeight: 1.2 }}>{children}</h1>;
          },
          h2({ children }) {
            return <h2 style={{ color: "#39FF14", fontWeight: 600, fontSize: "1.6em", margin: "1.1em 0 0.6em 0", lineHeight: 1.2 }}>{children}</h2>;
          },
          h3({ children }) {
            return <h3 style={{ color: "#39FF14", fontWeight: 500, fontSize: "1.2em", margin: "1em 0 0.5em 0", lineHeight: 1.2 }}>{children}</h3>;
          },
          blockquote({ children }) {
            return <blockquote style={{ borderLeft: "4px solid #39FF14", background: "#18181b", padding: "0.8em 1.2em", borderRadius: "0.5em", margin: "1.2em 0", fontStyle: "italic" }}>{children}</blockquote>;
          },
          ul({ children }) {
            return <ul style={{ margin: "1em 0 1em 1.5em", paddingLeft: "1.2em", listStyleType: "disc" }}>{children}</ul>;
          },
          ol({ children }) {
            return <ol style={{ margin: "1em 0 1em 1.5em", paddingLeft: "1.2em", listStyleType: "decimal" }}>{children}</ol>;
          },
          p({ children }) {
            return <p style={{ margin: "1em 0", lineHeight: 1.7, textIndent: "0.5em" }}>{children}</p>;
          },
          a({ href, children }) {
            return <a href={href} style={{ color: "#39FF14", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">{children}</a>;
          },
          img({ src, alt, ...props }) {
            const resolvedSrc = resolveImageUrl(src);
            return (
              <img
                src={resolvedSrc}
                alt={alt}
                style={{
                  maxWidth: "100%",
                  borderRadius: "0.75em",
                  margin: "1.5em auto",
                  display: "block",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                  background: "#18181b",
                  border: "1px solid #23272e",
                  objectFit: "contain",
                }}
                {...props}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
