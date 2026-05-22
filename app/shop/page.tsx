"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();

  const products = [
  { id: 1, img: "/product-1.jpg", name: "image showcases classic", description: "This image showcases a classic round, single-tier chocolate fudge cake, generously", price: 0, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "image presents premium,", description: "This image presents a premium, perfectly round blueberry cheesecake, categorized as a", price: 299, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "image showcases meticulously", description: "This image showcases a meticulously crafted, multi-layered red velvet cake, categorized", price: 399, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "image features premium,", description: "This image features a premium, circular celebration cake, falling under the", price: 499, badge: "" }
];

  const filters = ["All Cakes", "Chocolate", "Cheesecakes", "Seasonal Specials"];
  const [activeFilter, setActiveFilter] = useState("All Cakes");
  const [addedStates, setAddedStates] = useState<Record<number, boolean>>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [storyHovered, setStoryHovered] = useState(false);

  const filteredProducts =
    activeFilter === "All Cakes"
      ? products
      : products.filter((p) => p.category === activeFilter);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600;1,700&family=Source+Sans+3:wght@400;500;600&display=swap');
      :root {
        --bg: #110D08;
        --surface: #A67C52;
        --primary: #8C1C1D;
        --accent: #381E15;
        --text: #F5EFE8;
        --muted: #6B5A4A;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: var(--bg); color: var(--text); font-family: 'Source Sans 3', sans-serif; }
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .reveal-delay-1 { transition-delay: 0.1s; }
      .reveal-delay-2 { transition-delay: 0.2s; }
      .reveal-delay-3 { transition-delay: 0.3s; }
      .focus-ring:focus-visible { outline: 2px solid #A67C52; outline-offset: 3px; }
      @media (max-width: 767px) {
        .desktop-only { display: none !important; }
        .shop-grid { grid-template-columns: 1fr !important; }
      }
      @media (min-width: 768px) and (max-width: 1023px) {
        .shop-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
        .mobile-only { display: none !important; }
      }
      @media (min-width: 1024px) {
        .mobile-only { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredProducts]);

  function handleAddToCart(p: typeof products[0]) {
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedStates((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setAddedStates((prev) => ({ ...prev, [p.id]: false }));
    }, 1500);
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif", overflowX: "hidden" }}>

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(17,13,8,0.97)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(107,90,74,0.25)" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "background 250ms ease, border-bottom 250ms ease",
          padding: "0 32px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          className="mobile-only focus-ring"
          onClick={() => setMobileMenuOpen(true)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}
          aria-label="Open menu"
        >
          {[0,1,2].map((i) => (
            <span key={i} style={{ display: "block", width: "24px", height: "2px", background: "var(--text)", borderRadius: "2px" }} />
          ))}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.08)" }}>
            <img src="/logo.png" alt="Tier Chocolate logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
          </div>
        </div>

        <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {[
            { label: "Our Cakes", action: () => router.push("/shop") },
            { label: "Seasonal", action: () => router.push("/shop") },
            { label: "The Story", action: () => router.push("/") },
            { label: "Gifting", action: () => router.push("/shop") },
          ].map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="focus-ring"
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", fontWeight: 600,
                color: "var(--text)", letterSpacing: "0.01em",
                padding: "4px 0", position: "relative",
              }}
              onMouseEnter={(e) => {
                const underline = e.currentTarget.querySelector(".nav-underline") as HTMLElement;
                if (underline) underline.style.transform = "scaleX(1)";
              }}
              onMouseLeave={(e) => {
                const underline = e.currentTarget.querySelector(".nav-underline") as HTMLElement;
                if (underline) underline.style.transform = "scaleX(0)";
              }}
            >
              {link.label}
              <span className="nav-underline" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "var(--surface)", transform: "scaleX(0)", transformOrigin: "center", transition: "transform 200ms ease" }} />
            </button>
          ))}
        </div>

        <button
          className="focus-ring"
          onClick={() => router.push("/checkout")}
          style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "8px" }}
          aria-label="View cart"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)" }} onClick={() => setMobileMenuOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "85vw", maxWidth: "360px", background: "#1A1108", padding: "32px 24px", display: "flex", flexDirection: "column", gap: "0" }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Close menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            {[
              { label: "Our Cakes", action: () => { router.push("/shop"); setMobileMenuOpen(false); } },
              { label: "Seasonal", action: () => { router.push("/shop"); setMobileMenuOpen(false); } },
              { label: "The Story", action: () => { router.push("/"); setMobileMenuOpen(false); } },
              { label: "Gifting", action: () => { router.push("/shop"); setMobileMenuOpen(false); } },
            ].map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="focus-ring"
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: "20px", fontWeight: 600, color: "var(--text)", padding: "16px 0", textAlign: "left", borderBottom: "1px solid rgba(107,90,74,0.2)", height: "56px", display: "flex", alignItems: "center" }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SHOP HEADER */}
      <section style={{ paddingTop: "136px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px" }}>
            <span style={{ fontSize: "11px", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)" }}>
              OUR SIGNATURE
            </span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05, color: "var(--text)" }}>
              Artisanal Selection
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.125rem", lineHeight: 1.7, color: "var(--muted)", maxWidth: "480px" }}>
              Every cake is hand-crafted in small batches, using premium ingredients sourced from trusted suppliers across India.
            </p>
          </div>

          {/* TRUST BAR */}
          <div className="reveal reveal-delay-1" style={{ display: "flex", flexWrap: "wrap", gap: "32px", marginTop: "40px", paddingTop: "32px", borderTop: "1px solid rgba(107,90,74,0.25)" }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#A67C52" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, text: "4.9 / 5 — 3,200+ happy customers" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A67C52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, text: "Free delivery above ₹1,499" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A67C52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, text: "Handcrafted in India" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A67C52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, text: "Same-day delivery available" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {item.icon}
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "var(--muted)", fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER PILLS */}
      <section style={{ padding: "0 32px 48px", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="focus-ring"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "0 18px",
                  height: "36px",
                  borderRadius: "9999px",
                  border: activeFilter === f ? "none" : "1px solid rgba(107,90,74,0.4)",
                  background: activeFilter === f ? "var(--primary)" : "transparent",
                  color: activeFilter === f ? "var(--text)" : "var(--muted)",
                  cursor: "pointer",
                  transition: "background 180ms ease, color 180ms ease, border-color 180ms ease",
                  letterSpacing: "0.01em",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section style={{ padding: "0 32px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="shop-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {filteredProducts.map((p, idx) => (
              <article
                key={p.id}
                className={`reveal reveal-delay-${idx % 3}`}
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: "rgba(26,17,8,0.7)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transform: hoveredCard === p.id ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: hoveredCard === p.id
                    ? `0 16px 48px rgba(140,28,29,0.25), 0 4px 16px rgba(0,0,0,0.4)`
                    : "0 4px 24px rgba(0,0,0,0.3)",
                  transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid rgba(107,90,74,0.15)",
                }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              >
                {/* PRODUCT IMAGE */}
                <div style={{ overflow: "hidden", position: "relative", background: "#F9F7F5", flexShrink: 0 }}>
                  <img
                    src={p.img}
                    alt={p.label}
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      objectFit: "cover",
                      display: "block",
                      transform: hoveredCard === p.id ? "scale(1.05)" : "scale(1)",
                      transition: "transform 600ms ease",
                      boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
                    }}
                  />
                  {/* QUICK VIEW on hover */}
                  <div style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    opacity: hoveredCard === p.id ? 1 : 0,
                    transition: "opacity 200ms ease",
                    pointerEvents: hoveredCard === p.id ? "auto" : "none",
                  }}>
                    <span style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text)",
                      background: "rgba(17,13,8,0.85)",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      backdropFilter: "blur(8px)",
                      letterSpacing: "0.02em",
                      border: "1px solid rgba(166,124,82,0.4)",
                    }}>
                      Quick View
                    </span>
                  </div>
                </div>

                {/* CARD BODY */}
                <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "var(--text)",
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                  }}>
                    {p.label}
                  </h3>
                  <p style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "14px",
                    color: "var(--muted)",
                    lineHeight: 1.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {p.flavor}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px", flexWrap: "wrap", gap: "12px" }}>
                    <span style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#A67C52",
                    }}>
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>

                    <button
                      className="focus-ring"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        padding: "8px 18px",
                        borderRadius: "12px",
                        border: "1px solid rgba(166,124,82,0.5)",
                        background: addedStates[p.id] ? "var(--primary)" : "transparent",
                        color: addedStates[p.id] ? "var(--text)" : "#A67C52",
                        cursor: "pointer",
                        transition: "background 200ms ease, color 200ms ease, transform 100ms ease",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.01em",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
                      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                    >
                      {addedStates[p.id] ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>

                  {/* VIEW DETAILS hover link */}
                  <div style={{
                    overflow: "hidden",
                    maxHeight: hoveredCard === p.id ? "32px" : "0",
                    opacity: hoveredCard === p.id ? 1 : 0,
                    transition: "max-height 200ms ease, opacity 200ms ease",
                    marginTop: "4px",
                  }}>
                    <span style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text)",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                      cursor: "pointer",
                      letterSpacing: "0.01em",
                    }}>
                      View Details
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VISUAL FINGERPRINT — Artisanal Product Story Overlay */}
      <section style={{ padding: "96px 32px", background: "#1A1108", overflow: "hidden" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="reveal" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "64px", textAlign: "center" }}>
            <span style={{ fontSize: "11px", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)" }}>THE CRAFT</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", lineHeight: 1.1 }}>
              Our Signature Work
            </h2>
          </div>

          {/* ARTISANAL STORY OVERLAY CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "48px", alignItems: "start" }}>
            {products.map((p, idx) => (
              <div
                key={p.id}
                className={`reveal reveal-delay-${idx % 3}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  cursor: "pointer",
                  transition: "transform 350ms ease",
                  transform: "perspective(1000px) rotateY(0deg)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "perspective(1000px) rotateY(-2deg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg)"; }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              >
                {/* Square image with SVG curved text overlay */}
                <div style={{ position: "relative", width: "100%", maxWidth: "280px" }}>
                  <div style={{
                    overflow: "hidden",
                    width: "100%",
                    aspectRatio: "1/1",
                    background: "#F9F7F5",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
                    transform: idx % 2 === 0 ? "translateY(-12px) translateX(8px)" : "translateY(-8px) translateX(-8px)",
                    position: "relative",
                  }}>
                    <img
                      src={p.img}
                      alt={p.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    {/* Subtle dark overlay for text legibility */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,13,8,0.05) 0%, rgba(17,13,8,0.0) 100%)" }} />
                  </div>

                  {/* SVG curved text around top-left quadrant of image */}
                  <svg
                    viewBox="0 0 280 280"
                    width="100%"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      pointerEvents: "none",
                      transform: idx % 2 === 0 ? "translateY(-12px) translateX(8px)" : "translateY(-8px) translateX(-8px)",
                    }}
                  >
                    <defs>
                      <path
                        id={`curve-top-${p.id}`}
                        d={`M 30,140 A 110,110 0 0,1 140,30`}
                      />
                    </defs>
                    <text
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "13px",
                        fontStyle: "italic",
                        fill: "#A67C52",
                        letterSpacing: "0.04em",
                      }}
                    >
                      <textPath href={`#curve-top-${p.id}`} startOffset="5%">
                        {p.label} · Handcrafted ·
                      </textPath>
                    </text>
                  </svg>
                </div>

                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "6px", paddingTop: "8px" }}>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "20px",
                    fontStyle: "italic",
                    fontWeight: 600,
                    color: "var(--text)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                  }}>
                    {p.label}
                  </p>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                    {p.flavor}
                  </p>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "16px", fontWeight: 600, color: "#A67C52", marginTop: "4px" }}>
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE BAKER'S PROMISE */}
      <section style={{ padding: "96px 32px", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>
          <div className="reveal" style={{ overflow: "hidden", borderRadius: "16px", flexShrink: 0 }}>
            <img
              src="/product-1.jpg"
              alt="Hands decorating a premium chocolate fudge cake — the baker's promise of artisanal quality"
              style={{
                width: "100%",
                aspectRatio: "4/3",
                objectFit: "cover",
                display: "block",
                filter: "sepia(0.2) brightness(0.88)",
              }}
            />
          </div>
          <div className="reveal reveal-delay-1" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span style={{ fontSize: "11px", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)" }}>
              OUR DEDICATION
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Laurel wreath SVG */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0, transition: "transform 300ms ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.1) rotate(5deg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1) rotate(0deg)"; }}>
                <path d="M7 14 C5 11 4 8 6 6 C8 4 10 5 11 7" stroke="#A67C52" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M7 14 C5 17 4 20 6 22 C8 24 10 23 11 21" stroke="#A67C52" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M21 14 C23 11 24 8 22 6 C20 4 18 5 17 7" stroke="#A67C52" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M21 14 C23 17 24 20 22 22 C20 24 18 23 17 21" stroke="#A67C52" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="14" cy="14" r="2" fill="#A67C52"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--text)", fontStyle: "italic" }}>
              Our Dedication to Excellence
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "17px", lineHeight: 1.75, color: "#9A8070" }}>
              At Tier Chocolate, every cake is a labor of love, crafted by hand using the finest premium ingredients sourced across India. We believe great baking is a practice — measured in patience, technique, and the quality of every element that goes in.
            </p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "17px", lineHeight: 1.75, color: "#9A8070" }}>
              No shortcuts. No compromises. Every rosette piped, every layer assembled, every ganache poured with intention. That's our promise.
            </p>
            <button
              className="focus-ring"
              onClick={() => router.push("/shop")}
              style={{
                alignSelf: "flex-start",
                padding: "16px 40px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "var(--primary)",
                color: "var(--text)",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                boxShadow: `0 10px 30px -10px rgba(140,28,29,0.5)`,
                transition: "transform 200ms ease, box-shadow 200ms ease",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              Order Your Cake
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section id="testimonials" style={{ padding: "96px 32px", background: "#1C0E0E", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />
        <div className="reveal" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <svg width="48" height="36" viewBox="0 0 48 36" fill="rgba(166,124,82,0.4)" style={{ marginBottom: "32px", display: "block", margin: "0 auto 32px" }}>
            <path d="M0 36V22.5C0 15.5 2.7 9.7 8.1 5.1 13.5.5 20.1-1.1 28 .5l1.5 5.4C24.3 6.8 20.3 9.2 17.5 13c-2.8 3.8-4 7.4-3.6 10.8H22V36H0zm26 0V22.5c0-7 2.7-12.8 8.1-17.4C39.5.5 46.1-1.1 54 .5l1.5 5.4c-5.2.9-9.2 3.3-12 7.1-2.8 3.8-4 7.4-3.6 10.8H48V36H26z"/>
          </svg>
          <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontStyle: "italic", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: "28px" }}>
            Absolutely divine! The perfect centrepiece for our anniversary celebration. Every single bite was pure, unadulterated indulgence.
          </blockquote>
          <cite style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "16px", color: "#A67C52", fontStyle: "normal", fontWeight: 500 }}>
            — Rina S., Mumbai
          </cite>
        </div>
      </section>

      {/* DELIVERY SECTION */}
      <section style={{ padding: "96px 32px", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "3fr 2fr", gap: "64px", alignItems: "center" }}>
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span style={{ fontSize: "11px", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--muted)" }}>
              FROM PATISSERIE TO HOME
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.2, color: "var(--text)" }}>
              Freshness Delivered to Your Door
            </h3>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "16px", lineHeight: 1.65, color: "var(--muted)", maxWidth: "480px" }}>
              Each cake is packaged in our custom artisanal box — rigid, insulated, and beautiful. We use chilled gel packs for warm-weather delivery and partner with premium logistics to ensure your cake arrives in perfect condition, every time.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
              {[
                "Rigid, insulated custom gift boxes",
                "Chilled gel packs for summer delivery",
                "Same-day delivery in select cities",
                "Free delivery on orders above ₹1,499",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A67C52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "#9A8070" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal reveal-delay-1" style={{ overflow: "hidden", borderRadius: "16px" }}>
            <img
              src="/product-4.jpg"
              alt="Elegantly packaged Tier Chocolate cake in a gift box ready for delivery"
              style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", borderRadius: "8px" }}
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0A0805", borderTop: "1px solid rgba(107,90,74,0.2)", padding: "64px 32px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "48px", paddingBottom: "64px" }}>
            {/* COL 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <img src="/logo.png" alt="Tier Chocolate logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85, alignSelf: "flex-start" }} />
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "var(--muted)", lineHeight: 1.65, maxWidth: "200px" }}>
                Crafting moments of pure indulgence
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: "var(--text)", display: "flex", alignItems: "center", transition: "color 200ms ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#A67C52"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text)"; }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: "var(--text)", display: "flex", alignItems: "center", transition: "color 200ms ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#A67C52"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text)"; }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* COL 2 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text)" }}>Shop</span>
              {["Our Cakes", "Seasonal", "Gift Cards", "Wholesale"].map((link) => (
                <button key={link} onClick={() => router.push("/shop")} className="focus-ring"
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "var(--muted)", textAlign: "left", padding: 0, lineHeight: 1.6, transition: "color 150ms ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}>
                  {link}
                </button>
              ))}
            </div>

            {/* COL 3 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text)" }}>Learn</span>
              {["Our Story", "Ingredient Sourcing", "Press", "FAQ"].map((link) => (
                <button key={link} onClick={() => router.push("/")} className="focus-ring"
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px", color: "var(--muted)", textAlign: "left", padding: 0, lineHeight: 1.6, transition: "color 150ms ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}>
                  {link}
                </button>
              ))}
            </div>

            {/* COL 4 — NEWSLETTER */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600, color: "var(--text)" }}>Stay in the loop</h4>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "var(--muted)", lineHeight: 1.6 }}>
                New flavours, seasonal drops, and exclusive offers — straight to your inbox.
              </p>
              {!subscribed ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{
                      height: "48px",
                      padding: "0 16px",
                      borderRadius: "4px",
                      border: "1px solid rgba(107,90,74,0.4)",
                      background: "rgba(255,255,255,0.04)",
                      color: "var(--text)",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                  <button
                    className="focus-ring"
                    onClick={() => { if (email.includes("@")) setSubscribed(true); }}
                    style={{
                      height: "48px",
                      borderRadius: "4px",
                      border: "none",
                      background: "var(--primary)",
                      color: "var(--text)",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "15px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "transform 200ms ease, background 200ms ease",
                      letterSpacing: "0.01em",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    Subscribe
                  </button>
                </div>
              ) : (
                <div style={{ padding: "16px", borderRadius: "8px", background: "rgba(140,28,29,0.15)", border: "1px solid rgba(140,28,29,0.3)" }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px", color: "#A67C52", fontWeight: 500 }}>
                    ✓ You're on the list! Expect something delicious soon.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM STRIP */}
          <div style={{ borderTop: "1px solid rgba(107,90,74,0.2)", paddingTop: "24px", paddingBottom: "32px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "var(--muted)" }}>© 2026 Tier Chocolate</span>
              {["Privacy Policy", "Terms of Service"].map((link) => (
                <button key={link} onClick={() => router.push("/")} className="focus-ring"
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", color: "var(--muted)", padding: 0, transition: "color 150ms ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}>
                  {link}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              {["VISA", "MC", "AMEX", "UPI"].map((p) => (
                <span key={p} style={{
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "10px", fontWeight: 700,
                  color: "var(--muted)", border: "1px solid rgba(107,90,74,0.3)", padding: "4px 8px",
                  borderRadius: "4px", letterSpacing: "0.06em"
                }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}