import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const features = [
    {
      icon: "⚡",
      title: "Real-time sync",
      desc: "Every keystroke synced instantly across all collaborators via WebSocket.",
    },
    {
      icon: "💬",
      title: "Built-in chat",
      desc: "Discuss code without leaving the editor. Presence indicators show who's online.",
    },
    {
      icon: "▶",
      title: "Run code",
      desc: "Execute Python, JavaScript, Java and more directly in the browser.",
    },
    {
      icon: "🔒",
      title: "Private rooms",
      desc: "Password-protect your sessions. Share only with who you want.",
    },
    {
      icon: "📁",
      title: "Multiple files",
      desc: "Organise work across files with a VS Code-style tab system.",
    },
    {
      icon: "📜",
      title: "Code history",
      desc: "Snapshot and restore any version of your code with one click.",
    },
  ];

  const stack = [
    "Spring Boot",
    "WebSocket",
    "Redis",
    "React",
    "PostgreSQL",
    "JWT",
  ];

  return (
    <div
      style={{
        background: "#080c10",
        minHeight: "100vh",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        color: "#e2e8f0",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .glow-cursor {
          position: fixed;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: left 0.3s ease, top 0.3s ease;
          z-index: 0;
        }

        .nav-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 400;
          transition: color 0.2s;
          cursor: pointer;
        }
        .nav-link:hover { color: #e2e8f0; }

        .btn-primary {
          background: #22c55e;
          color: #080c10;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s, transform 0.1s;
          letter-spacing: 0.01em;
        }
        .btn-primary:hover { background: #16a34a; transform: translateY(-1px); }

        .btn-secondary {
          background: transparent;
          color: #e2e8f0;
          border: 1px solid #1e293b;
          padding: 10px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-secondary:hover { border-color: #334155; color: #f8fafc; }

        .feature-card {
          background: #0d1117;
          border: 1px solid #161b22;
          border-radius: 10px;
          padding: 28px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .feature-card:hover { border-color: #22c55e22; transform: translateY(-2px); }

        .code-window {
          background: #0d1117;
          border: 1px solid #161b22;
          border-radius: 10px;
          overflow: hidden;
        }
        .code-dot { width: 10px; height: 10px; border-radius: 50%; }

        .stack-tag {
          background: #0d1117;
          border: 1px solid #1e293b;
          color: #64748b;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .divider { border: none; border-top: 1px solid #0f172a; margin: 0; }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cursor { animation: blink 1s infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.2s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.35s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.5s; opacity: 0; }

        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e;
          display: inline-block;
          margin-right: 6px;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)}
          50%{box-shadow:0 0 0 4px rgba(34,197,94,0)}
        }
      `}</style>

      {/* Cursor glow */}
      <div
        className="glow-cursor"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(8,12,16,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #0f172a",
          padding: "0 40px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🔥</span>
          <span
            style={{
              fontWeight: 600,
              fontSize: "16px",
              color: "#f8fafc",
              letterSpacing: "-0.01em",
            }}
          >
            PairCode
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <span
            className="nav-link"
            onClick={() =>
              document
                .getElementById("features")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Features
          </span>
          <span
            className="nav-link"
            onClick={() =>
              document
                .getElementById("stack")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Stack
          </span>
          <span className="nav-link" onClick={() => navigate("/login")}>
            Login
          </span>

          <button className="btn-primary" onClick={() => navigate("/login")}>
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "100px",
          paddingLeft: "40px",
          paddingRight: "40px",
          maxWidth: "900px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="fade-up fade-up-1"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#0d1117",
            border: "1px solid #161b22",
            padding: "5px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            color: "#64748b",
            fontFamily: "'DM Mono', monospace",
            marginBottom: "32px",
          }}
        >
          <span className="live-dot" />
          Real-time collaborative code editor
        </div>

        <h1
          className="fade-up fade-up-2"
          style={{
            fontSize: "clamp(40px, 6vw, 68px)",
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "#f8fafc",
            marginBottom: "24px",
          }}
        >
          Code together,
          <br />
          <span style={{ color: "#22c55e" }}>in real time.</span>
        </h1>

        <p
          className="fade-up fade-up-3"
          style={{
            fontSize: "17px",
            color: "#64748b",
            lineHeight: 1.7,
            maxWidth: "520px",
            marginBottom: "40px",
            fontWeight: 300,
          }}
        >
          PairCode is a collaborative coding environment where teams write, run,
          and discuss code simultaneously — no extensions, no setup, just a
          link.
        </p>

        <div
          className="fade-up fade-up-4"
          style={{ display: "flex", gap: "12px", alignItems: "center" }}
        >
          <button
            className="btn-primary"
            style={{ padding: "12px 28px", fontSize: "15px" }}
            onClick={() => navigate("/login")}
          >
            Start coding free
          </button>

          <button
            className="btn-secondary"
            style={{ padding: "12px 28px", fontSize: "15px" }}
            onClick={() =>
              document
                .getElementById("features")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            See how it works
          </button>
        </div>
      </section>

      {/* Editor preview */}
      <section
        style={{
          padding: "0 40px 100px",
          maxWidth: "1000px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="code-window">
          {/* Title bar */}
          <div
            style={{
              background: "#0d1117",
              borderBottom: "1px solid #161b22",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div className="code-dot" style={{ background: "#ff5f57" }} />
            <div className="code-dot" style={{ background: "#febc2e" }} />
            <div className="code-dot" style={{ background: "#28c840" }} />
            <div style={{ flex: 1, textAlign: "center" }}>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "11px",
                  color: "#334155",
                  letterSpacing: "0.05em",
                }}
              >
                main.py — PairCode · Room 9828E1E2
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="live-dot" />
              <span
                style={{
                  fontSize: "11px",
                  color: "#22c55e",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                2 online
              </span>
            </div>
          </div>

          {/* Code */}
          <div style={{ display: "flex" }}>
            {/* Line numbers */}
            <div
              style={{
                padding: "20px 16px",
                background: "#0d1117",
                borderRight: "1px solid #0f172a",
                fontFamily: "'DM Mono', monospace",
                fontSize: "13px",
                color: "#1e293b",
                lineHeight: "22px",
                userSelect: "none",
                minWidth: "48px",
                textAlign: "right",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div key={n}>{n}</div>
              ))}
            </div>

            {/* Code content */}
            <div
              style={{
                padding: "20px 24px",
                flex: 1,
                fontFamily: "'DM Mono', monospace",
                fontSize: "13px",
                lineHeight: "22px",
                color: "#94a3b8",
              }}
            >
              <div>
                <span style={{ color: "#7c6af7" }}>def</span>{" "}
                <span style={{ color: "#38bdf8" }}>fibonacci</span>
                <span style={{ color: "#94a3b8" }}>(n):</span>
              </div>
              <div style={{ paddingLeft: "20px" }}>
                <span style={{ color: "#7c6af7" }}>if</span> n{" "}
                <span style={{ color: "#f472b6" }}>{"<="}</span>{" "}
                <span style={{ color: "#fb923c" }}>1</span>
                <span style={{ color: "#94a3b8" }}>:</span>
              </div>
              <div style={{ paddingLeft: "40px" }}>
                <span style={{ color: "#7c6af7" }}>return</span>{" "}
                <span style={{ color: "#94a3b8" }}>n</span>
              </div>
              <div style={{ paddingLeft: "20px" }}>
                <span style={{ color: "#7c6af7" }}>return</span> fibonacci(n
                <span style={{ color: "#f472b6" }}>-</span>
                <span style={{ color: "#fb923c" }}>1</span>){" "}
                <span style={{ color: "#f472b6" }}>+</span> fibonacci(n
                <span style={{ color: "#f472b6" }}>-</span>
                <span style={{ color: "#fb923c" }}>2</span>)
              </div>
              <div>&nbsp;</div>
              <div>
                <span style={{ color: "#64748b" }}>
                  # Generate first 10 Fibonacci numbers
                </span>
              </div>
              <div>
                result <span style={{ color: "#f472b6" }}>=</span> [fibonacci(i){" "}
                <span style={{ color: "#7c6af7" }}>for</span> i{" "}
                <span style={{ color: "#7c6af7" }}>in</span>{" "}
                <span style={{ color: "#38bdf8" }}>range</span>(
                <span style={{ color: "#fb923c" }}>10</span>)]
              </div>
              <div>
                <span style={{ color: "#38bdf8" }}>print</span>(result)
                <span className="cursor" style={{ color: "#22c55e" }}>
                  |
                </span>
              </div>
              <div>&nbsp;</div>
              <div
                style={{
                  background: "#0a1628",
                  border: "1px solid #1e293b",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  marginTop: "4px",
                  color: "#22c55e",
                  fontSize: "12px",
                }}
              >
                ▶ Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
              </div>
            </div>

            {/* Chat sidebar */}
            <div
              style={{
                width: "220px",
                borderLeft: "1px solid #0f172a",
                padding: "20px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#334155",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.05em",
                }}
              >
                CHAT
              </div>
              {[
                {
                  user: "sakshi",
                  msg: "let's test edge cases",
                  color: "#22c55e",
                },
                { user: "testuser", msg: "n=0 returns 0 ✓", color: "#38bdf8" },
                {
                  user: "sakshi",
                  msg: "looks good, ship it",
                  color: "#22c55e",
                },
              ].map((m, i) => (
                <div key={i}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: m.color,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {m.user}
                  </span>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#475569",
                      marginTop: "2px",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.msg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Features */}
      <section
        id="features"
        style={{ padding: "100px 40px", maxWidth: "1000px", margin: "0 auto" }}
      >
        <div style={{ marginBottom: "64px" }}>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "12px",
              color: "#334155",
              letterSpacing: "0.1em",
              marginBottom: "16px",
            }}
          >
            FEATURES
          </p>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#f8fafc",
              lineHeight: 1.2,
            }}
          >
            Everything you need
            <br />
            to code together.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: "22px", marginBottom: "16px" }}>
                {f.icon}
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#f8fafc",
                  marginBottom: "8px",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#475569",
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Stack */}
      <section
        id="stack"
        style={{ padding: "100px 40px", maxWidth: "1000px", margin: "0 auto" }}
      >
        <div style={{ marginBottom: "48px" }}>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "12px",
              color: "#334155",
              letterSpacing: "0.1em",
              marginBottom: "16px",
            }}
          >
            BUILT WITH
          </p>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#f8fafc",
            }}
          >
            Production-grade stack.
          </h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {stack.map((s) => (
            <span key={s} className="stack-tag">
              {s}
            </span>
          ))}
        </div>
        <p
          style={{
            marginTop: "32px",
            fontSize: "14px",
            color: "#334155",
            fontWeight: 300,
            lineHeight: 1.7,
          }}
        >
          Backend powered by Spring Boot 3 with STOMP WebSockets and Redis
          pub/sub for multi-instance broadcasting. Frontend built on React 18
          with Monaco Editor — the same engine behind VS Code.
        </p>
      </section>

      <hr className="divider" />

      {/* CTA */}
      <section
        style={{
          padding: "100px 40px",
          maxWidth: "700px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "#f8fafc",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Ready to build
          <br />
          together?
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#475569",
            marginBottom: "40px",
            fontWeight: 300,
          }}
        >
          Create a room, share the link, start coding.
          <br />
          No installs. No accounts needed to join.
        </p>
        <button
          className="btn-primary"
          style={{ padding: "14px 36px", fontSize: "15px" }}
          onClick={() => navigate("/login")}
        >
          Open PairCode →
        </button>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #0f172a",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🔥</span>
          <span style={{ fontWeight: 500, fontSize: "14px", color: "#334155" }}>
            PairCode
          </span>
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#1e293b",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Built with Spring Boot + React
        </div>
      </footer>
    </div>
  );
}
