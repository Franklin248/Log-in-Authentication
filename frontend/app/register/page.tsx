"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import CapybaraMascot, {
  type CapybaraField,
} from "@/components/CapybaraMascot";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://log-in-authentication.onrender.com";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [activeField, setActiveField] =
    useState<CapybaraField>("register-name");
  const [typingVersion, setTypingVersion] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setMessage("");
    setSuccess(false);

    const formData = new FormData(form);

    const name = (formData.get("name") as string).trim();
    const username = (formData.get("username") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email: email || null,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Registration failed."
        );
      }

      setSuccess(true);
      setMessage("Account created successfully! You can now sign in.");

      form.reset();

      setShowPassword(false);
      setShowConfirmPassword(false);
      setPasswordFocused(false);

      setActiveField("register-name");
      setTypingVersion((version) => version + 1);
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

      <header className="auth-header register-header">
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
              <span className="eyebrow">BEGIN YOUR JOURNEY</span>

              <h1>Create account.</h1>

              <p className="login-description">
                Join us and create your personal space.
              </p>

              <CapybaraMascot
                coverEyes={
                  passwordFocused &&
                  !showPassword &&
                  !showConfirmPassword
                }
                peek={showPassword || showConfirmPassword}
                field={activeField}
                typingVersion={typingVersion}
              />

              <form onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="name">Full name</label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    maxLength={100}
                    required
                    onFocus={() =>
                      setActiveField("register-name")
                    }
                    onChange={() =>
                      setTypingVersion((version) => version + 1)
                    }
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="username">Username</label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    autoComplete="username"
                    minLength={3}
                    maxLength={50}
                    required
                    onFocus={() =>
                      setActiveField("register-username")
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
                      setActiveField("register-email")
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
                      placeholder="Create a password"
                      autoComplete="new-password"
                      minLength={8}
                      onFocus={() => {
                        setActiveField("register-password");
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

                <div className="form-field">
                  <label htmlFor="confirmPassword">
                    Confirm password
                  </label>

                  <div className="password-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      minLength={8}
                      onFocus={() => {
                        setActiveField("register-confirm");
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
                        setShowConfirmPassword((previous) => !previous)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="signin-button"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                  <span>↗</span>
                </button>

                {message && (
                  <p
                    className="form-message"
                    role="status"
                    style={{
                      color: success ? "#7c9b78" : "#c47c6b",
                    }}
                  >
                    {message}
                  </p>
                )}
              </form>

              <p className="register-prompt">
                Already have an account?{" "}
                <Link href="/">Sign in</Link>
              </p>
            </div>
          </div>

          <div className="welcome-side">
            <div className="welcome-content">
              <span className="eyebrow">WELCOME TO THE CAPY-CLUB!</span>

              <h2>Join the Hap-pybara Family!</h2>

              <p>
                No need to rush. Create your account, get comfy, and enjoy
                the capybara life!
              </p>
            </div>

            <span className="welcome-index">02 / JOIN US</span>
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