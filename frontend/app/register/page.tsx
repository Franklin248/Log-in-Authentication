
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    setMessage("");
    setSuccess(false);

    const formData = new FormData(form);

    const name = (formData.get("name") as string).trim();
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
          email,
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
        <Image
          src="/images/Logo.gif"
          alt="Logo"
          width={75}
          height={55}
          unoptimized
          priority
          className="auth-logo"
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
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={150}
                    required
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
                      required
                    />

                    <button
                      type="button"
                      className="show-password"
                      onClick={() => setShowPassword(!showPassword)}
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
                      required
                    />

                    <button
                      type="button"
                      className="show-password"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
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
              <span className="eyebrow">A NEW BEGINNING</span>

              <h2>Make yourself at home.</h2>

              <p>
                A little space that's yours, whenever you need it.
              </p>
            </div>

            <span className="welcome-index">02 / JOIN US</span>
          </div>
        </div>
      </section>

      <footer className="auth-footer">
        <span>© 2026. All rights reserved.</span>

        <div>
          <a href="#" onClick={(event) => event.preventDefault()}>
            Privacy policy
          </a>

          <a href="#" onClick={(event) => event.preventDefault()}>
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
}
