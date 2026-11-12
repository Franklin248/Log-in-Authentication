"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import CapybaraMascot, {
  type CapybaraField,
} from "@/components/CapybaraMascot";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Home() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeField, setActiveField] =
    useState<CapybaraField>("login-username");
  const [typingVersion, setTypingVersion] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const username = (formData.get("username") as string).trim();
    const password = formData.get("password") as string;

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Invalid username or password."
        );
      }

      if (rememberMe) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem("access_token", data.access_token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }

      router.push("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="geometry geometry-one" />
      <div className="geometry geometry-two" />

      <header className="auth-header">
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
      </header>

      <section className="auth-stage">
        <div className="auth-panel">
          <div className="login-side">
            <div className="login-content">
              <span className="eyebrow">
                Capybara Login Authenticator
              </span>

              <h1>Welcome Back!</h1>

              <p className="login-description">
                Sign in to continue to your account.
              </p>

              <CapybaraMascot
                coverEyes={passwordFocused && !showPassword}
                peek={showPassword}
                field={activeField}
                typingVersion={typingVersion}
              />

              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="username">Username</label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    autoComplete="username"
                    minLength={3}
                    maxLength={50}
                    required
                    onFocus={() =>
                      setActiveField("login-username")
                    }
                    onChange={() =>
                      setTypingVersion((version) => version + 1)
                    }
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">
                    Email address <span>(Optional)</span>
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={150}
                    onFocus={() =>
                      setActiveField("login-email")
                    }
                    onChange={() =>
                      setTypingVersion((version) => version + 1)
                    }
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="password">Password</label>

                  <div className="password-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      onFocus={() => {
                        setActiveField("login-password");
                        setPasswordFocused(true);
                      }}
                      onBlur={() => setPasswordFocused(false)}
                      onChange={() =>
                        setTypingVersion((version) => version + 1)
                      }
                      required
                    />

                    <button
                      type="button"
                      className="show-password"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-option">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                    />

                    <span>Remember me</span>
                  </label>

                  <Link href="/forgot-password">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="signin-button"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                  <span>↗</span>
                </button>

                {message && (
                  <p className="form-message" role="status">
                    {message}
                  </p>
                )}
              </form>

              <p className="register-prompt">
                Don&apos;t have an account?{" "}
                <Link href="/register">Create account</Link>
              </p>
            </div>
          </div>

          <div className="welcome-side">
            <div className="welcome-content">
              <span className="eyebrow">HAP-PYBARA LOGIN!!</span>

              <h2>OH, CAPY-DAY!</h2>

              <p>Hop in, your account is waiting!</p>
            </div>

            <span className="welcome-index">
              01 / WELCOME
            </span>
          </div>
        </div>
      </section>

      <footer className="auth-footer">
        <span>© 2026. All rights reserved.</span>

        <div>
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
          >
            Privacy policy
          </a>

          <a
            href="#"
            onClick={(event) => event.preventDefault()}
          >
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
}