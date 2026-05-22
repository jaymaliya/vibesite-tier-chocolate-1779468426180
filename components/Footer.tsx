"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { label: "Home", route: "/" },
  { label: "Shop", route: "/shop" },
];

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleSubscribe = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  };

  return (
    <footer
      style={{
        backgroundColor: "#110D08",
        borderTop: "1px solid #381E15",
        padding: "96px 24px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        {/* Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px",
            marginBottom: "64px",
          }}
        >
          {/* Brand Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <img
              src="/logo.png"
              alt="Tier Chocolate logo"
              style={{
                height: "32px",
                objectFit: "contain",
                opacity: 0.85,
                display: "block",
              }}
            />
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "#6B5A4A",
                maxWidth: "260px",
              }}
            >
              Layered luxury, unmistakably handcrafted. Every cake is made to
              order with the finest ingredients — no shortcuts, no compromises.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <SocialButton
                href="https://instagram.com"
                label="Follow Tier Chocolate on Instagram"
              >
                <InstagramIcon />
              </SocialButton>
              <SocialButton
                href="https://twitter.com"
                label="Follow Tier Chocolate on Twitter"
              >
                <TwitterIcon />
              </SocialButton>
              <SocialButton
                href="https://wa.me"
                label="Chat with Tier Chocolate on WhatsApp"
              >
                <WhatsAppIcon />
              </SocialButton>
            </div>
          </div>

          {/* Quick Links Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#F5EFE8",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Quick Links
            </h3>
            <nav aria-label="Footer navigation">
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <FooterNavButton
                      label={link.label}
                      onClick={() => router.push(link.route)}
                    />
                  </li>
                ))}
                <li>
                  <FooterNavButton
                    label="About Us"
                    onClick={() =>
                      document
                        .getElementById("about")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  />
                </li>
                <li>
                  <FooterNavButton
                    label="Custom Orders"
                    onClick={() =>
                      document
                        .getElementById("about")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  />
                </li>
              </ul>
            </nav>
          </div>

          {/* Info Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#F5EFE8",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              We Promise
            </h3>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {[
                "Made fresh to order",
                "Free delivery above ₹1,499",
                "100% natural ingredients",
                "Made in India",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "14px",
                    color: "#6B5A4A",
                    lineHeight: 1.6,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "9999px",
                      backgroundColor: "#A67C52",
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "#F5EFE8",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Stay in the Loop
            </h3>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "14px",
                color: "#6B5A4A",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              New seasonal menus, early access, and behind-the-scenes from the
              kitchen — directly to your inbox.
            </p>

            {subscribed ? (
              <div
                role="status"
                style={{
                  backgroundColor: "#381E15",
                  borderRadius: "12px",
                  padding: "16px",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "14px",
                  color: "#A67C52",
                  lineHeight: 1.6,
                }}
              >
                You&apos;re on the list. Expect something delicious soon.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    gap: "0",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: emailError ? "1px solid #8C1C1D" : "1px solid #381E15",
                    transition:
                      "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="your@email.com"
                    aria-label="Email address for newsletter"
                    aria-describedby={emailError ? "newsletter-error" : undefined}
                    style={{
                      flex: 1,
                      backgroundColor: "#1A1109",
                      border: "none",
                      outline: "none",
                      padding: "12px 16px",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "14px",
                      color: "#F5EFE8",
                      minWidth: 0,
                    }}
                  />
                  <button
                    onClick={handleSubscribe}
                    aria-label="Subscribe to newsletter"
                    style={{
                      backgroundColor: "#8C1C1D",
                      border: "none",
                      cursor: "pointer",
                      color: "#F5EFE8",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      padding: "12px 20px",
                      outline: "none",
                      whiteSpace: "nowrap",
                      transition:
                        "background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "#a82122";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "#8C1C1D";
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(0.98)";
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "scale(1)";
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 0 0 2px #A67C52";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                    }}
                  >
                    Subscribe
                  </button>
                </div>
                {emailError && (
                  <p
                    id="newsletter-error"
                    role="alert"
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "12px",
                      color: "#8C1C1D",
                      margin: 0,
                      paddingLeft: "4px",
                    }}
                  >
                    {emailError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "#381E15",
            marginBottom: "32px",
          }}
        />

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "13px",
              color: "#6B5A4A",
              margin: 0,
            }}
          >
            &copy; {new Date().getFullYear()} Tier Chocolate. All rights reserved. Made with care in India.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() =>
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "12px",
                    color: "#6B5A4A",
                    padding: 0,
                    outline: "none",
                    transition:
                      "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#A67C52";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#6B5A4A";
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#F5EFE8";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#6B5A4A";
                  }}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        backgroundColor: "#1A1109",
        border: "1px solid #381E15",
        color: "#6B5A4A",
        outline: "none",
        transition:
          "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.color = "#A67C52";
        el.style.backgroundColor = "#381E15";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.color = "#6B5A4A";
        el.style.backgroundColor = "#1A1109";
        el.style.transform = "translateY(0)";
      }}
      onFocus={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.boxShadow = "0 0 0 2px #8C1C1D";
        el.style.color = "#A67C52";
      }}
      onBlur={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.boxShadow = "none";
        el.style.color = "#6B5A4A";
      }}
    >
      {children}
    </a>
  );
}

function FooterNavButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "14px",
        fontWeight: 400,
        color: "#6B5A4A",
        padding: 0,
        outline: "none",
        textAlign: "left",
        transition:
          "color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.color = "#A67C52";
        el.style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.color = "#6B5A4A";
        el.style.transform = "translateX(0)";
      }}
      onFocus={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.color = "#F5EFE8";
        el.style.boxShadow = "0 0 0 2px #8C1C1D";
      }}
      onBlur={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.color = "#6B5A4A";
        el.style.boxShadow = "none";
      }}
    >
      {label}
    </button>
  );
}