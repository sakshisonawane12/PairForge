import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, getMyRooms, getMyProfile, getRoom } from "../services/api";
import { clearToken } from "../services/auth";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    getMyProfile()
      .then((res) => setUsername(res.data.username))
      .catch(() => {});

    // Fetch owned rooms
    getMyRooms()
      .then(async (res) => {
        const owned = res.data;
        // Also fetch any visited rooms stored in localStorage
        const visited = JSON.parse(localStorage.getItem("visitedRooms") || "[]");
        const ownedCodes = new Set(owned.map((r) => r.roomCode));
        const extraCodes = visited.filter((code) => !ownedCodes.has(code));
        if (extraCodes.length === 0) { setMyRooms(owned); return; }
        const extras = await Promise.allSettled(
          extraCodes.map((code) => getRoom(code))
        );
        const extraRooms = extras
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value.data);
        setMyRooms([...owned, ...extraRooms]);
      })
      .catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createRoom({ name: roomName, password: roomPassword });
      navigate(`/room/${res.data.roomCode}`);
    } catch {
      alert("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (joinCode.trim()) navigate(`/room/${joinCode.trim().toUpperCase()}`);
  };

  const handleLogout = async () => {
    await clearToken();
    navigate("/");
  };

  const langMeta = {
    javascript: { label: "JS", color: "#F0DB4F", bg: "rgba(240,219,79,0.12)" },
    python: { label: "PY", color: "#4B8BBE", bg: "rgba(75,139,190,0.12)" },
    java: { label: "JV", color: "#F89820", bg: "rgba(248,152,32,0.12)" },
    cpp: { label: "C++", color: "#9C6EF9", bg: "rgba(156,110,249,0.12)" },
    typescript: { label: "TS", color: "#3178C6", bg: "rgba(49,120,198,0.12)" },
    go: { label: "GO", color: "#00ADD8", bg: "rgba(0,173,216,0.12)" },
  };

  const initials = username ? username.slice(0, 2).toUpperCase() : "??";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        color: "var(--text-primary)",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          height: "56px",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "var(--text-primary)",
            }}
          >
            PairCode
          </span>
          <span
            style={{
              fontSize: "10px",
              padding: "2px 7px",
              borderRadius: "20px",
              background: "rgba(35,134,54,0.2)",
              color: "var(--accent-green)",
              border: "1px solid rgba(63,185,80,0.3)",
              letterSpacing: "0.5px",
              fontWeight: 600,
            }}
          >
            BETA
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <ThemeToggle />
          <button
            onClick={() => navigate("/profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              fontSize: "13px",
              padding: 0,
              fontFamily: "inherit",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #238636, #1f6feb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {initials}
            </div>
            <span>{username}</span>
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid var(--border-mid)",
              color: "var(--text-muted)",
              fontSize: "12px",
              cursor: "pointer",
              padding: "5px 12px",
              borderRadius: "6px",
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = "var(--accent-red)";
              e.target.style.color = "var(--accent-red)";
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = "var(--border-mid)";
              e.target.style.color = "var(--text-muted)";
            }}
          >
            logout
          </button>
        </div>
      </nav>

      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "3rem 2rem",
          width: "100%",
        }}
      >
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "2.5rem",
          }}
        >
          {[
            { label: "rooms", value: myRooms.length },
            { label: "collaborators", value: 12 },
            { label: "files edited", value: 35 },
            { label: "code runs", value: 87 },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-surface)",
                padding: "1.25rem 1.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-faint)",
                  margin: "0 0 6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  margin: 0,
                  color: "var(--text-primary)",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Create / Join */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "2.5rem",
          }}
        >
          <div style={{ background: "var(--bg-surface)", padding: "2rem" }}>
            <p
              style={{
                fontSize: "11px",
                color: "var(--accent-green)",
                margin: "0 0 1.25rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              — new room
            </p>
            <form
              onSubmit={handleCreate}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                placeholder="room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                style={inputStyle()}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--accent-green)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <input
                type="password"
                placeholder="password (optional)"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                style={inputStyle()}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--accent-green)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "4px",
                  padding: "10px",
                  background: loading ? "var(--bg-elevated)" : "#238636",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
                onMouseOver={(e) => {
                  if (!loading) e.target.style.background = "#2ea043";
                }}
                onMouseOut={(e) => {
                  if (!loading) e.target.style.background = "#238636";
                }}
              >
                {loading ? "creating..." : "+ create room"}
              </button>
            </form>
          </div>

          <div
            style={{
              background: "var(--bg-surface)",
              padding: "2rem",
              borderLeft: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: "var(--accent-blue)",
                margin: "0 0 1.25rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              — join room
            </p>
            <form
              onSubmit={handleJoin}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                placeholder="enter room code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                required
                style={{
                  ...inputStyle(),
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--accent-blue)")
                }
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <button
                type="submit"
                style={{
                  marginTop: "4px",
                  padding: "10px",
                  background: "transparent",
                  border: "1px solid var(--accent-blue)",
                  borderRadius: "6px",
                  color: "var(--accent-blue)",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "var(--accent-blue)";
                  e.target.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "var(--accent-blue)";
                }}
              >
                → join
              </button>
            </form>
          </div>
        </div>

        {/* Rooms list */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-faint)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              recent workspaces
            </p>
            <span style={{ fontSize: "11px", color: "var(--text-faint)" }}>
              {myRooms.length} rooms
            </span>
          </div>

          {myRooms.length === 0 ? (
            <div
              style={{
                border: "1px dashed var(--border)",
                borderRadius: "10px",
                padding: "3rem",
                textAlign: "center",
                color: "var(--text-faint)",
                fontSize: "13px",
              }}
            >
              no rooms yet — create one above
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1px",
                background: "var(--border)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {myRooms.map((room, i) => {
                const meta = langMeta[room.language] || {
                  label: "??",
                  color: "var(--text-muted)",
                  bg: "rgba(139,148,158,0.1)",
                };
                return (
                  <div
                    key={room.id}
                    onClick={() => navigate(`/room/${room.roomCode}`)}
                    style={{
                      background: "var(--bg-surface)",
                      padding: "1.25rem 1.5rem",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      borderRight:
                        (i + 1) % 2 !== 0 ? "1px solid var(--border)" : "none",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "var(--bg-elevated)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "var(--bg-surface)")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "12px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: "0 0 4px",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {room.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "11px",
                            color: "var(--text-faint)",
                          }}
                        >
                          {new Date(room.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          background: meta.bg,
                          color: meta.color,
                          letterSpacing: "0.5px",
                          flexShrink: 0,
                          marginLeft: "8px",
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--accent-green)",
                          letterSpacing: "1px",
                        }}
                      >
                        {room.roomCode}
                      </span>
                      <span
                        style={{ fontSize: "12px", color: "var(--text-faint)" }}
                      >
                        open →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = () => ({
  width: "100%",
  boxSizing: "border-box",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  padding: "9px 12px",
  color: "var(--text-primary)",
  fontSize: "13px",
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  outline: "none",
  transition: "border-color 0.15s",
});
