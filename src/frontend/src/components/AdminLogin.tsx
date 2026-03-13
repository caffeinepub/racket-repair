import { AlertCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === "admin" && password === "racketfix2024") {
      localStorage.setItem("racketfix_admin", "true");
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#eef2ff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <ShieldCheck style={{ color: "#1a56db", width: 32, height: 32 }} />
          <span
            style={{ color: "#1a56db", fontWeight: 800, fontSize: "1.5rem" }}
          >
            RacketFix
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #c7d8f5",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 24px rgba(26,86,219,0.12)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h1
              style={{
                color: "#0f2d6e",
                fontWeight: 800,
                fontSize: "1.8rem",
                margin: "0 0 4px 0",
              }}
            >
              Admin Login
            </h1>
            <p style={{ color: "#5c7aaa", fontSize: "0.9rem", margin: 0 }}>
              Sign in to view repair bookings
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="username"
                style={{
                  display: "block",
                  color: "#0f2d6e",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  marginBottom: "6px",
                }}
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                data-ocid="admin.input"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1.5px solid #c7d8f5",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  color: "#0f2d6e",
                  backgroundColor: "#f4f8ff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  color: "#0f2d6e",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                data-ocid="admin.input"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1.5px solid #c7d8f5",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  color: "#0f2d6e",
                  backgroundColor: "#f4f8ff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div
                data-ocid="admin.error_state"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#dc2626",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fca5a5",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontSize: "0.88rem",
                  marginBottom: "16px",
                }}
              >
                <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                {error}
              </div>
            )}

            <button
              type="submit"
              data-ocid="admin.submit_button"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#1a56db",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                marginTop: "8px",
              }}
            >
              Sign In
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#5c7aaa",
            fontSize: "0.78rem",
            marginTop: "16px",
          }}
        >
          Admin access only — not for customers
        </p>
      </div>
    </div>
  );
}
