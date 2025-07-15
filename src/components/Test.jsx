import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import "github-markdown-css/github-markdown.css";

function CodeBlock({ className, children }) {
  const [copied, setCopied] = React.useState(false);
  const language = className ? className.replace("language-", "") : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

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
            fontSize: "1em",
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

  if (loading) return <div>Loading Markdown...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className + "text-2xl"}>{children}</CodeBlock>;
          },
          table({ children }) {
            return (
              <div style={{ overflowX: "auto" }}>
                <table>{children}</table>
              </div>
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
