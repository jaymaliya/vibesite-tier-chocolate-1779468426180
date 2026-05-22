"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

const NAV_LINKS = [
  { label: "Shop", route: "/shop" },
  { label: "Seasonal", route: null },
  { label: "The Story", route: null },
  { label: "Gifting", route: null },
];

function CartIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);
  const prevTotalRef = useRef(totalItems);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (totalItems !== prevTotalRef.current && totalItems > 0) {
      setBadgeBump(true);
      const t = setTimeout(() => setBadgeBump(false), 350);
      prevTotalRef.current = totalItems;
      return () => clearTimeout(t);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  const handleNavClick = (link: (typeof NAV_LINKS)[number]) => {
    setMobileOpen(false);
    if (link.route) {
      router.push(link.route);
    } else {
      const el = document.getElementById("about");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#110D08",
          borderBottom: scrolled ? "1px solid #381E15" : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 24px 0 rgba(140,28,29,0.12)"
            : "none",
          transition:
            "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav
          aria-label="Main navigation"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "72px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Logo */}
          <div style={{ flex: "0 0 auto", zIndex: 10 }}>
            <img
              src="/logo.png"
              alt="Tier Chocolate logo"
              style={{ height: "40px", objectFit: "contain", cursor: "pointer", display: "block" }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Desktop Nav Links — centered absolutely */}
          <div
            aria-label="Site navigation links"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "40px",
            }}
            className="hidden-mobile"
          >
            {NAV_LINKS.map((link) => (
              <NavLinkButton
                key={link.label}
                label={link.label}
                onClick={() => handleNavClick(link)}
              />
            ))}
          </div>

          {/* Right side: Cart + Hamburger */}
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              zIndex: 10,
            }}
          >
            {/* Cart button */}
            <button
              aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              onClick={() => router.push("/checkout")}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#F5EFE8",
                padding: "8px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                transition:
                  "transform 0.25s cubic-bezier(0.4,0,0.2,1), color 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#A67C52";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#F5EFE8";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 0 2px #8C1C1D";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              <CartIcon />
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: "#8C1C1D",
                    color: "#F5EFE8",
                    borderRadius: "9999px",
                    minWidth: "16px",
                    height: "16px",
                    fontSize: "10px",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 3px",
                    transform: badgeBump ? "scale(1.35)" : "scale(1)",
                    transition:
                      "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#F5EFE8",
                padding: "8px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                transition:
                  "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
              }}
              className="show-mobile"
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 0 2px #8C1C1D";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </nav>

        {/* Mobile Overlay Menu */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          style={{
            position: "fixed",
            inset: "0",
            backgroundColor: "#110D08",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? "auto" : "none",
            transition:
              "opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
          className="show-mobile"
        >
          {/* Close button inside overlay */}
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "24px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#F5EFE8",
              padding: "8px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              outline: "none",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 0 2px #8C1C1D";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            <HamburgerIcon open={true} />
          </button>

          {NAV_LINKS.map((link, idx) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#F5EFE8",
                fontFamily: "'Playfair Display', serif",
                fontSize: "28px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                padding: "12px 24px",
                borderRadius: "12px",
                outline: "none",
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.3s cubic-bezier(0.4,0,0.2,1) ${idx * 60}ms, transform 0.3s cubic-bezier(0.4,0,0.2,1) ${idx * 60}ms, color 0.2s cubic-bezier(0.4,0,0.2,1)`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#A67C52";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#F5EFE8";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 0 0 2px #8C1C1D";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => {
              setMobileOpen(false);
              router.push("/checkout");
            }}
            style={{
              marginTop: "24px",
              background: "#8C1C1D",
              border: "none",
              cursor: "pointer",
              color: "#F5EFE8",
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              padding: "14px 32px",
              borderRadius: "12px",
              outline: "none",
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.3s cubic-bezier(0.4,0,0.2,1) ${NAV_LINKS.length * 60}ms, transform 0.3s cubic-bezier(0.4,0,0.2,1) ${NAV_LINKS.length * 60}ms`,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 0 2px #A67C52";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            <CartIcon />
            Cart {totalItems > 0 ? `(${totalItems})` : ""}
          </button>
        </div>
      </header>

      {/* Scoped CSS for responsive helpers — injected into globals must be in globals.css.
          We use a style element ONLY in non-client server component context.
          Since this is "use client", we apply inline via className and a small injected rule via globals.
          Instead, we control show/hide purely via inline styles + JS:
          The hidden-mobile and show-mobile classes are already defined in globals.css. */}
    </>
  );
}

function NavLinkButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={(e) => {
        setHovered(true);
        (e.currentTarget as HTMLButtonElement).style.outline = "none";
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          "0 0 0 2px #8C1C1D";
      }}
      onBlur={(e) => {
        setHovered(false);
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#F5EFE8",
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "15px",
        fontWeight: 600,
        letterSpacing: "0.01em",
        padding: "4px 0",
        borderRadius: "4px",
        outline: "none",
        position: "relative",
        transition:
          "color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {label}
      {/* Underline bar */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-2px",
          left: "50%",
          transform: hovered ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
          transformOrigin: "center",
          width: "100%",
          height: "1px",
          backgroundColor: "#A67C52",
          display: "block",
          transition:
            "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </button>
  );
}