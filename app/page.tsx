"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";

const GOLD = "#B8860B";
const CHOC = "#4A2C2C";

const products = [
  { id: 1, img: "/product-1.jpg", name: "The Classic Fudge Cake", description: "Rich dark chocolate, ridged buttercream, piped rosettes", price: 1250 },
  { id: 2, img: "/product-2.jpg", name: "The Blueberry Cheesecake", description: "Premium cream cheese, fresh blueberry compote", price: 299 },
  { id: 3, img: "/product-3.jpg", name: "The Red Velvet Cake", description: "Velvety layers, cream cheese frosting, handcrafted finish", price: 399 },
  { id: 4, img: "/product-4.jpg", name: "The Celebration Cake", description: "Festive tiers, artisan décor, made to order", price: 499 },
];

const seasonalProducts = [
  { id: 2, img: "/product-2.jpg", name: "Summer Blueberry Dream", bg: "#2A1F3D" },
  { id: 3, img: "/product-3.jpg", name: "Harvest Red Velvet", bg: "#3D1A0A" },
  { id: 4, img: "/product-4.jpg", name: "Festive Celebration", bg: "#1A2D1A" },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem, items } = useCart();
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredSeasonal, setHoveredSeasonal] = useState<number | null>(null);
  const revealRefs = useRef<HTMLElement[]>([]);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Source+Sans+3:wght@400;500;600&display=swap');
      :root {
        --bg: #110D08;
        --surface: #A67C52;
        --primary: #8C1C1D;
        --accent: #381E15;
        --text: #F5EFE8;
        --muted: #6B5A4A;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: var(--bg); color: var(--text); font-family: 'Source Sans 3', sans-serif; overflow-x: hidden; }
      .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .reveal-1 { transition-delay: 0.1s; }
      .reveal-2 { transition-delay: 0.2s; }
      .reveal-3 { transition-delay: 0.3s; }
      .reveal-4 { transition-delay: 0.4s; }
      .underline-gold { position: relative; }
      .underline-gold::after { content:''; position:absolute; bottom:-2px; left:50%; width:0; height:1px; background:${GOLD}; transition: width 0.2s ease, left 0.2s ease; }
      .underline-gold:hover::after { width:100%; left:0; }
      ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--muted); border-radius:3px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = (p: typeof products[0]) => {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleSubscribe = () => {
    if (subscribeEmail.trim()) {
      setSubscribed(true);
      setSubscribeEmail("");
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "'Source Sans 3', sans-serif" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navScrolled ? "rgba(17,13,8,0.97)" : "transparent",
        borderBottom: navScrolled ? "1px solid rgba(107,90,74,0.3)" : "none",
        transition: "background 0.25s ease, border-bottom 0.25s ease",
        backdropFilter: navScrolled ? "blur(12px)" : "none",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ padding: "4px 8px", borderRadius: 8, background: "rgba(255,255,255,0.07)" }}>
            <img src="/logo.png" alt="Tier Chocolate logo" style={{ height: 40, objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
          </div>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 40, alignItems: "center" }} className="desktop-nav">
            {[
              { label: "Our Cakes", action: () => router.push("/shop") },
              { label: "Seasonal", action: () => router.push("/shop") },
              { label: "The Story", action: () => document.getElementById("bakers-promise")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "Gifting", action: () => router.push("/shop") },
            ].map((link) => (
              <button key={link.label} onClick={link.action} className="underline-gold"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 600, color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", padding: "4px 0", letterSpacing: "0.01em" }}
                onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${GOLD}`)}
                onBlur={(e) => (e.currentTarget.style.outline = "none")}>
                {link.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Cart */}
            <button onClick={() => router.push("/checkout")} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 8 }}
              onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${GOLD}`)}
              onBlur={(e) => (e.currentTarget.style.outline = "none")}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: 2, right: 2, background: GOLD, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Source Sans 3', sans-serif" }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 8 }}
              className="hamburger-btn"
              onFocus={(e) => (e.currentTarget.style.outline = `2px solid ${GOLD}`)}
              onBlur={(e) => (e.currentTarget.style.outline = "none")}>
              {[0,1,2].map(i => (
                <span key={i} style={{ display: "block", width: 24, height: 2, background: "var(--text)", borderRadius: 2 }} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)" }} onClick={() => setMobileOpen(false)}>
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "85vw", maxWidth: 360, background: "#1A120B", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 0 }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
              <img src="/logo.png" alt="Tier Chocolate logo" style={{ height: 36, objectFit: "contain" }} />
              <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            {[
              { label: "Our Cakes", action: () => { router.push("/shop"); setMobileOpen(false); } },
              { label: "Seasonal", action: () => { router.push("/shop"); setMobileOpen(false); } },
              { label: "The Story", action: () => { document.getElementById("bakers-promise")?.scrollIntoView({ behavior: "smooth" }); setMobileOpen(false); } },
              { label: "Gifting", action: () => { router.push("/shop"); setMobileOpen(false); } },
            ].map((link) => (
              <button key={link.label} onClick={link.action}
                style={{ background: "none", border: "none", borderBottom: "1px solid rgba(107,90,74,0.2)", cursor: "pointer", fontSize: 20, fontWeight: 600, color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", padding: "18px 0", textAlign: "left", height: 56, display: "flex", alignItems: "center" }}>
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "40% 60%", overflow: "hidden", paddingTop: 72 }}>
        {/* Left text column */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "96px 48px 96px 64px", gap: 28 }}>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>
            HANDCRAFTED INDULGENCE
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(3.2rem, 5.5vw, 5.5rem)", letterSpacing: "-0.04em", lineHeight: 1.05, color: "var(--text)" }}>
            <span style={{ color: GOLD }}>Layered</span>{" "}
            luxury,<br />unmistakably<br />handcrafted.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--muted)", maxWidth: 420, fontFamily: "'Source Sans 3', sans-serif" }}>
            Every cake at Tier Chocolate begins with single-origin cocoa and ends with a rosette piped by hand. No shortcuts. Just craft.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={() => router.push("/shop")}
              style={{ alignSelf: "flex-start", padding: "18px 40px", borderRadius: 4, border: "none", cursor: "pointer", background: GOLD, color: "#fff", fontSize: 18, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", letterSpacing: "0.01em", transition: "background 0.2s ease, transform 0.15s ease", boxShadow: `0 8px 24px -8px ${GOLD}80` }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#9A6F08"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.transform = "scale(1)"; }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}>
              Order Your Cake
            </button>
            <span style={{ fontSize: 14, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>
              Crafted with premium ingredients. Delivered fresh.
            </span>
          </div>

          {/* Trust signals */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", paddingTop: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={GOLD}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              4.9 / 5 · 8,400+ reviews
            </span>
            <span>🇮🇳 Made in India</span>
            <span>Free delivery over ₹1,999</span>
          </div>
        </div>

        {/* Right product image — bleeds to edge */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: 600 }}>
          <img src="/product-1.jpg" alt="Classic chocolate fudge cake with piped rosettes on a white ceramic plate"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "transform 0.7s ease" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
          {/* Scrim on left edge to blend with text column */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #110D08 0%, transparent 18%)", pointerEvents: "none" }} />
        </div>
      </section>

      {/* VISUAL FINGERPRINT — Artisanal Product Story Overlay */}
      <section className="reveal" style={{ background: "#1A100A", padding: "96px 64px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 64, flexWrap: "wrap" }}>
          {/* Product image with SVG textPath */}
          <div style={{ position: "relative", flexShrink: 0, transform: "translateY(-20px) translateX(30px)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "perspective(1000px) rotateY(-2deg) translateY(-24px) translateX(30px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-20px) translateX(30px)"; }}
            style={{ position: "relative", flexShrink: 0, transform: "translateY(-20px) translateX(30px)", transition: "transform 350ms cubic-bezier(0.4,0,0.2,1)" }}>
            <div style={{ width: 340, height: 340, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.4)", position: "relative" }}>
              <img src="/product-1.jpg" alt="The Classic Fudge Cake — artisan chocolate creation"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {/* SVG curved text around top-left quadrant */}
            <svg style={{ position: "absolute", top: -30, left: -30, width: 400, height: 400, pointerEvents: "none", overflow: "visible" }} viewBox="0 0 340 340">
              <defs>
                <path id="textCirclePath" d="M 170,170 m -130,0 a 130,130 0 1,1 260,0 a 130,130 0 1,1 -260,0" />
              </defs>
              <text fill={GOLD} fontSize="14" fontFamily="'Playfair Display', serif" fontStyle="italic" letterSpacing="3">
                <textPath href="#textCirclePath" startOffset="0%">
                  ✦ The Classic Fudge ✦ Handcrafted Daily ✦ Single Origin Cocoa ✦
                </textPath>
              </text>
            </svg>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontStyle: "italic", color: "var(--text)", textAlign: "center", marginTop: 16, letterSpacing: "-0.01em" }}>
              The Classic Fudge
            </p>
          </div>

          {/* Story text */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", display: "block", marginBottom: 16 }}>
              OUR SIGNATURE
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)", marginBottom: 24 }}>
              A cake that earns its place at every table.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "var(--muted)", marginBottom: 32, fontFamily: "'Source Sans 3', sans-serif" }}>
              Dark, ridged, rosette-crowned. The Classic Fudge Cake is piped by hand each morning using 70% single-origin cocoa from the Western Ghats. Every ridge is intentional. Every shaving, deliberate.
            </p>
            <button onClick={() => router.push(`/product?name=${encodeURIComponent(products[0].name)}&price=${products[0].price}&img=${encodeURIComponent(products[0].img)}`)}
              style={{ padding: "14px 32px", borderRadius: 4, border: `1px solid ${GOLD}`, cursor: "pointer", background: "transparent", color: GOLD, fontSize: 15, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", transition: "background 0.2s ease, color 0.2s ease, transform 0.15s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; e.currentTarget.style.transform = "scale(1)"; }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}>
              View Details
            </button>
          </div>
        </div>
      </section>

      {/* SIGNATURE CAKES */}
      <section className="reveal" style={{ padding: "96px 64px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56, textAlign: "center" }}>
            <span className="reveal" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", display: "block", marginBottom: 16 }}>
              ARTISANAL SELECTION
            </span>
            <h2 className="reveal" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)" }}>
              Our Signature Cakes
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
            {products.map((p, i) => (
              <article key={p.id} className={`reveal reveal-${i + 1}`}
                style={{
                  cursor: "pointer", borderRadius: 0, background: "#F9F7F5",
                  boxShadow: hoveredCard === p.id ? `0 16px 48px rgba(140,28,29,0.18)` : `0 4px 16px rgba(0,0,0,0.12)`,
                  transform: hoveredCard === p.id ? "translateY(-8px)" : "translateY(0)",
                  transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}>
                <div style={{ overflow: "hidden", aspectRatio: "1/1", boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)" }}>
                  <img src={p.img} alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s ease", transform: hoveredCard === p.id ? "scale(1.03)" : "scale(1)" }} />
                </div>
                <div style={{ padding: "24px 20px 28px", textAlign: "center" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 22, color: CHOC, marginBottom: 8, letterSpacing: "-0.01em" }}>{p.name}</h3>
                  <p style={{ fontSize: 15, color: "#888", fontFamily: "'Source Sans 3', sans-serif", marginBottom: 12, lineHeight: 1.5 }}>{p.description}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: GOLD, fontFamily: "'Source Sans 3', sans-serif", marginBottom: 16 }}>
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                  <button
                    style={{
                      fontSize: 13, fontWeight: 600, color: hoveredCard === p.id ? CHOC : "transparent",
                      fontFamily: "'Source Sans 3', sans-serif", background: "none", border: "none", cursor: "pointer",
                      textDecoration: "underline", textDecorationColor: hoveredCard === p.id ? GOLD : "transparent",
                      transition: "color 0.2s ease, text-decoration-color 0.2s ease",
                    }}
                    onClick={(e) => { e.stopPropagation(); router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`); }}>
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BAKER'S PROMISE */}
      <section id="bakers-promise" className="reveal" style={{ background: "#FDFBF8", padding: "96px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, alignItems: "stretch" }}>
          {/* Left image */}
          <div style={{ overflow: "hidden", minHeight: 480 }}>
            <img src="/product-2.jpg" alt="Artisan baker decorating a premium cheesecake with fresh ingredients"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.2) brightness(0.9)", transition: "transform 0.7s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
          </div>
          {/* Right text */}
          <div style={{ padding: "64px 72px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>
              THE BAKER'S PROMISE
            </span>
            {/* SVG laurel icon */}
            <div style={{ display: "inline-block", cursor: "default" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1) rotate(5deg)"; (e.currentTarget as HTMLElement).style.transition = "transform 300ms ease"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1) rotate(0deg)"; }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4 C10 8 6 12 8 18 C10 22 14 24 16 24 C18 24 22 22 24 18 C26 12 22 8 16 4Z" stroke={GOLD} strokeWidth="1.5" fill="none"/>
                <path d="M8 16 C5 14 3 11 5 8" stroke={GOLD} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                <path d="M24 16 C27 14 29 11 27 8" stroke={GOLD} strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                <path d="M16 24 L16 28" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M12 27 L20 27" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600, fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)", color: CHOC, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
              Our Dedication to Excellence
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: CHOC, fontFamily: "'Source Sans 3', sans-serif", maxWidth: 480 }}>
              At Tier Chocolate, every cake is a labor of love, crafted by hand using responsibly sourced cocoa and seasonal produce. We rise at 4am to ensure that by the time a box reaches your door, it carries the full warmth of the morning.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "#666", fontFamily: "'Source Sans 3', sans-serif", maxWidth: 480 }}>
              No premixes. No artificial flavours. Just the honest work of bakers who care deeply about what they put in — and what you take away.
            </p>
            <button onClick={() => router.push("/shop")}
              style={{ alignSelf: "flex-start", padding: "14px 32px", borderRadius: 4, border: `1px solid ${CHOC}`, cursor: "pointer", background: "transparent", color: CHOC, fontSize: 15, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", transition: "background 0.2s ease, color 0.2s ease, transform 0.15s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = CHOC; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = CHOC; e.currentTarget.style.transform = "scale(1)"; }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}>
              Explore Our Range
            </button>
          </div>
        </div>
      </section>

      {/* SEASONAL CAROUSEL */}
      <section className="reveal" style={{ padding: "96px 0", background: "var(--bg)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", paddingLeft: 64 }}>
          <div style={{ marginBottom: 48 }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", display: "block", marginBottom: 16 }}>
              SEASONAL INDULGENCES
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem, 3vw, 2.8rem)", letterSpacing: "-0.03em", color: "var(--text)" }}>
              Limited Edition Flavours
            </h2>
          </div>
          <div style={{ display: "flex", gap: 24, overflowX: "auto", paddingRight: 64, paddingBottom: 16, scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
            {seasonalProducts.map((sp) => {
              const product = products.find(p => p.id === sp.id)!;
              return (
                <div key={sp.id}
                  style={{ flexShrink: 0, width: 300, scrollSnapAlign: "start", position: "relative", cursor: "pointer", borderRadius: 4, overflow: "hidden" }}
                  onMouseEnter={() => setHoveredSeasonal(sp.id)}
                  onMouseLeave={() => setHoveredSeasonal(null)}>
                  <div style={{ aspectRatio: "3/4", overflow: "hidden", background: sp.bg }}>
                    <img src={sp.img} alt={sp.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s ease, filter 0.25s ease", transform: hoveredSeasonal === sp.id ? "scale(1.03)" : "scale(1)", filter: hoveredSeasonal === sp.id ? "saturate(1.1)" : "saturate(1)" }} />
                    {/* Overlay */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 24px 28px", background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 20, color: "#fff", textAlign: "center", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{sp.name}</p>
                      <button
                        style={{ padding: "8px 20px", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 4, background: "transparent", color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", cursor: "pointer", opacity: hoveredSeasonal === sp.id ? 1 : 0, transition: "opacity 0.25s ease, transform 0.15s ease" }}
                        onClick={() => router.push(`/product?name=${encodeURIComponent(product.name)}&price=${product.price}&img=${encodeURIComponent(product.img)}`)}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                        Discover
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="reveal" style={{ background: "#1A0A0A", padding: "96px 48px", backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")", backgroundBlendMode: "multiply" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <svg width="40" height="32" viewBox="0 0 40 32" fill={GOLD} style={{ marginBottom: 32, opacity: 0.7 }}>
            <path d="M0 20 Q0 4 16 0 L18 4 Q8 8 8 20 L16 20 L16 32 L0 32 Z M24 20 Q24 4 40 0 L42 4 Q32 8 32 20 L40 20 L40 32 L24 32 Z" transform="scale(0.85)"/>
          </svg>
          <blockquote style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: "#fff", lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: 32 }}>
            "Absolutely divine! The perfect centrepiece for our anniversary celebration. Every bite was pure indulgence — it tasted like something you'd find in a Parisian patisserie."
          </blockquote>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.65)" }}>
            — Rina S., Mumbai
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 24 }}>
            {[0,1,2,3,4].map(i => (
              <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={GOLD}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERY SECTION */}
      <section className="reveal" style={{ background: "#F8F8F8", padding: "96px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "60% 40%", gap: 0, alignItems: "center" }}>
          <div style={{ padding: "64px 72px 64px 80px" }}>
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", display: "block", marginBottom: 16 }}>
              FROM OUR PATISSERIE
            </span>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 32, color: CHOC, marginBottom: 24, lineHeight: 1.2 }}>
              Freshness Delivered to Your Door
            </h3>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: CHOC, fontFamily: "'Source Sans 3', sans-serif", marginBottom: 16, maxWidth: 520 }}>
              Each Tier Chocolate cake travels in a custom-engineered insulated box, designed to maintain the exact temperature gradient that keeps buttercream firm and shavings intact — from our cold room to your kitchen.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "#666", fontFamily: "'Source Sans 3', sans-serif", maxWidth: 520, marginBottom: 32 }}>
              We deliver across Mumbai, Pune, and Bengaluru with same-day slots available for orders placed before noon. Free delivery on orders over ₹1,999.
            </p>
            <div style={{ display: "flex", gap: 40 }}>
              {[["Same-day Delivery", "Orders before 12pm"], ["Insulated Packaging", "Stays fresh in transit"], ["100% Handcrafted", "No premix shortcuts"]].map(([title, sub]) => (
                <div key={title}>
                  <p style={{ fontWeight: 600, fontSize: 15, color: CHOC, fontFamily: "'Source Sans 3', sans-serif" }}>{title}</p>
                  <p style={{ fontSize: 13, color: "#888", fontFamily: "'Source Sans 3', sans-serif", marginTop: 4 }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "64px 80px 64px 0" }}>
            <div style={{ overflow: "hidden", borderRadius: 8 }}>
              <img src="/product-3.jpg" alt="Elegantly packaged Tier Chocolate cake ready for delivery"
                style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS CTA BAR */}
      <section className="reveal" style={{ background: "var(--primary)", padding: "64px 48px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", color: "var(--text)", letterSpacing: "-0.02em" }}>
              Something special is always in the oven.
            </h3>
            <p style={{ fontSize: 16, color: "rgba(245,239,232,0.7)", fontFamily: "'Source Sans 3', sans-serif", marginTop: 8 }}>
              New seasonal flavours drop every fortnight. Be first to know.
            </p>
          </div>
          <button onClick={() => router.push("/shop")}
            style={{ padding: "16px 40px", borderRadius: 4, border: "2px solid var(--text)", cursor: "pointer", background: "transparent", color: "var(--text)", fontSize: 16, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", transition: "background 0.2s ease, color 0.2s ease, transform 0.15s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.transform = "scale(1)"; }}>
            See the Collection
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0A0704", padding: "80px 64px 0", borderTop: "1px solid rgba(107,90,74,0.2)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, paddingBottom: 64 }}>

          {/* Col 1: Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ padding: "4px 8px", borderRadius: 8, background: "rgba(255,255,255,0.07)", alignSelf: "flex-start" }}>
              <img src="/logo.png" alt="Tier Chocolate logo" style={{ height: 32, objectFit: "contain", opacity: 0.85 }} />
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", maxWidth: 220 }}>
              Crafting moments of pure indulgence
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--text)", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = GOLD)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text)")}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--text)", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = GOLD)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text)")}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Shop */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif" }}>Shop</p>
            {[
              { label: "Our Cakes", action: () => router.push("/shop") },
              { label: "Seasonal", action: () => router.push("/shop") },
              { label: "Gift Cards", action: () => router.push("/shop") },
              { label: "Wholesale", action: () => router.push("/shop") },
            ].map((link) => (
              <button key={link.label} onClick={link.action}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", textAlign: "left", padding: 0, textDecoration: "none", transition: "color 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                {link.label}
              </button>
            ))}
          </div>

          {/* Col 3: Learn */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600, color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif" }}>Learn</p>
            {[
              { label: "Our Story", action: () => document.getElementById("bakers-promise")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "Ingredient Sourcing", action: () => document.getElementById("bakers-promise")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "Press", action: () => router.push("/shop") },
              { label: "FAQ", action: () => router.push("/shop") },
            ].map((link) => (
              <button key={link.label} onClick={link.action}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", textAlign: "left", padding: 0, transition: "color 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                {link.label}
              </button>
            ))}
          </div>

          {/* Col 4: Newsletter */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: 18, color: "var(--text)" }}>Stay in the loop</p>
            <p style={{ fontSize: 14, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.6 }}>
              New flavours, seasonal drops, and behind-the-scenes stories.
            </p>
            {subscribed ? (
              <p style={{ fontSize: 14, color: GOLD, fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500 }}>
                ✓ You're on the list. Expect something sweet.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input type="email" placeholder="your@email.com" value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  style={{ height: 48, padding: "0 16px", borderRadius: 4, border: "1px solid rgba(107,90,74,0.4)", background: "rgba(255,255,255,0.05)", color: "var(--text)", fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", outline: "none" }} />
                <button onClick={handleSubscribe}
                  style={{ height: 48, borderRadius: 4, border: "none", cursor: "pointer", background: GOLD, color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", transition: "background 0.2s ease, transform 0.15s ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#9A6F08"; e.currentTarget.style.transform = "scale(1.02)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.transform = "scale(1)"; }}>
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer bottom strip */}
        <div style={{ borderTop: "1px solid rgba(107,90,74,0.2)", paddingTop: 24, paddingBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>© 2026 Tier Chocolate</span>
            {["Privacy Policy", "Terms of Service"].map((label) => (
              <button key={label}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", padding: 0, transition: "color 0.2s ease", textDecoration: "underline", textDecorationColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                {label}
              </button>
            ))}
          </div>
          {/* Payment icons */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {[["Visa", "M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"], ["UPI", "M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"]].map(([name]) => (
              <div key={name} style={{ background: "rgba(107,90,74,0.25)", borderRadius: 4, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", letterSpacing: "0.05em" }}>
                {name}
              </div>
            ))}
            <div style={{ background: "rgba(107,90,74,0.25)", borderRadius: 4, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", letterSpacing: "0.05em" }}>MC</div>
            <div style={{ background: "rgba(107,90,74,0.25)", borderRadius: 4, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", letterSpacing: "0.05em" }}>AMEX</div>
          </div>
        </div>
      </footer>

      {/* Global responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 901px) {
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          section[style*="grid-template-columns: 40% 60%"] { grid-template-columns: 1fr !important; }
          section[style*="grid-template-columns: 40% 60%"] > div:first-child { padding: 80px 32px 48px !important; }
          section[style*="grid-template-columns: 40% 60%"] > div:last-child { min-height: 400px !important; }
          section[style*="grid-template-columns: 1fr 1fr"], section[style*="grid-template-columns: 60% 40%"] { grid-template-columns: 1fr !important; }
          section[style*="padding: 96px 64px"] { padding: 64px 24px !important; }
          section[style*="padding: 96px 0"] > div[style*="padding-left: 64px"] { padding-left: 24px !important; }
          footer { padding: 64px 24px 0 !important; }
        }
      `}</style>
    </div>
  );
}