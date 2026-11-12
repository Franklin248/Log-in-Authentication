
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type User = {
  id?: number;
  userId?: number;
  name: string;
  email: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function verifyUser() {
      const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      const savedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          sessionStorage.removeItem("access_token");
          sessionStorage.removeItem("user");

          router.replace("/");
          return;
        }

        const data = await response.json();
        const storedUser = savedUser ? JSON.parse(savedUser) : {};

        setUser({
          ...storedUser,
          ...data.user,
          name: storedUser.name || "User",
          email: data.user.email,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    verifyUser();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);

    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      console.error("Logout request failed.");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user");

      router.replace("/");
    }
  }

  if (loading) {
    return (
      <main className="auth-page">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#eee5d8",
            fontSize: "14px",
            letterSpacing: "2px",
          }}
        >
          VERIFYING YOUR SESSION...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="auth-page">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "16px",
            color: "#eee5d8",
          }}
        >
          <h2>Unable to load your account.</h2>
          <button
            className="signin-button"
            onClick={() => router.replace("/")}
          >
            Return to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="geometry geometry-one" />
      <div className="geometry geometry-two" />

      <header
        className="auth-header"
        style={{
          position: "absolute",
          top: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "min(1160px, 91%)",
          boxSizing: "border-box",
          padding: 0,
          zIndex: 10,
        }}
      >
     <img
  src="/images/CapyLogo.gif"
  alt="Capybara Logo"
  width={150}
  height={110}
  className="auth-logo"
  style={{
    width: "150px",
    height: "auto",
    maxWidth: "100%",
    objectFit: "contain",
  }}
/>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            padding: "14px 28px",
            minWidth: "125px",
            border: "1px solid rgba(238, 229, 216, 0.3)",
            borderRadius: "30px",
            background: "rgba(255,255,255,0.09)",
            color: "#eee5d8",
            cursor: "pointer",
            backdropFilter: "blur(15px)",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "1.2px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {loggingOut ? "Signing out..." : "LOG OUT ↗"}
        </button>
      </header>

      <section
        className="auth-stage"
        style={{
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div
          className="auth-panel"
          style={{
            width: "100%",
            maxWidth: "1000px",
            minHeight: "460px",
          }}
        >
          <div
            className="login-side"
            style={{
              justifyContent: "center",
            }}
          >
            <div className="login-content">
              <span className="eyebrow">YOUR PERSONAL SPACE</span>

              <h1 style={{ marginBottom: "12px" }}>
                Welcome, {user.name.split(" ")[0]}.
              </h1>

              <p className="login-description">
                You're signed in and ready to go.
              </p>

              <div
                style={{
                  marginTop: "42px",
                  padding: "25px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <span
                  className="eyebrow"
                  style={{ display: "block", marginBottom: "20px" }}
                >
                  ACCOUNT INFORMATION
                </span>

                <div style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      opacity: 0.55,
                      marginBottom: "6px",
                    }}
                  >
                    FULL NAME
                  </p>

                  <p style={{ fontSize: "16px" }}>{user.name}</p>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      opacity: 0.55,
                      marginBottom: "6px",
                    }}
                  >
                    EMAIL ADDRESS
                  </p>

                  <p style={{ fontSize: "16px", overflowWrap: "anywhere" }}>
                    {user.email}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      opacity: 0.55,
                      marginBottom: "6px",
                    }}
                  >
                    ACCOUNT ID
                  </p>

                  <p style={{ fontSize: "16px" }}>
                    #{user.userId ?? user.id ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="welcome-side">
            <div className="welcome-content">
              <span className="eyebrow">CAPY-VERIFIED SESSION</span>

              <h2>You're right where you capy-should be.</h2>

              <p>
                Your account is all settled in, and your session has been successfully capy-tured. Welcome back!
              </p>
            </div>

            <span className="welcome-index">03 / DASHBOARD</span>
          </div>
        </div>

        <p
          style={{
            color: "#eee5d8",
            opacity: 0.5,
            fontSize: "11px",
            letterSpacing: "1px",
            textAlign: "center",
          }}
        >
          YOUR SPACE. YOUR ACCOUNT. YOUR EXPERIENCE.
        </p>
      </section>

      <footer className="auth-footer">
        <span>© 2026. All rights reserved.</span>

        <div>
          <span>SECURE SESSION</span>
        </div>
      </footer>
    </main>
  );
}