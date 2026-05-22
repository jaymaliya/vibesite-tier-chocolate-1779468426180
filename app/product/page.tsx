"use client";
export const dynamic = 'force-dynamic';

import { useCart } from "../../components/CartContext";
import { useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

const PRODUCTS = [
  { id: 1, img: "/product-1.jpg", name: "The Classic Fudge Cake", description: "A classic round, single-tier chocolate fudge cake, generously enrobed in rich, dark chocolate buttercream frosting with meticulous piped rosettes and abundant chocolate shavings.", price: 1250 },
  { id: 2, img: "/product-2.jpg", name: "Blueberry Cheesecake", description: "A premium, perfectly round blueberry cheesecake with a velvety cream cheese filling and a jewelled crown of fresh blueberries.", price: 299 },
  { id: 3, img: "/product-3.jpg", name: "Red Velvet Celebration", description: "A meticulously crafted multi-layered red velvet cake with classic cream cheese frosting and a striking crimson crumb.", price: 399 },
  { id: 4, img: "/product-4.jpg", name: "Grand Celebration Cake", description: "A premium circular celebration cake adorned with elegant decorations, perfect for life's most memorable moments.", price: 499 },
];

const SIZES = ["Small (500g)", "Medium (1kg)", "Large (1.5kg)", "Extra Large (2kg)"];
const SIZE_PRICE: Record<string, number> = { "Small (500g)": 0, "Medium (1kg)": 250, "Large (1.5kg)": 500, "Extra Large (2kg)": 800 };

const REVIEWS = [
  { name: "Priya S.", location: "Mumbai", date: "Dec 2024", rating: 5, text: "Absolutely divine! The perfect centrepiece for our anniversary. Every bite was pure indulgence — the frosting alone is worth the price." },
  { name: "Arjun M.", location: "Bangalore", date: "Nov 2024", rating: 5, text: "Ordered for my daughter's birthday. The cake arrived perfectly intact, beautifully boxed, and tasted even better than it looked. Will reorder." },
  { name: "Sneha R.", location: "Delhi", date: "Nov 2024", rating: 5, text: "The chocolate depth here is unreal. Not too sweet, incredibly moist, and the rosette piping is gorgeous. Premium all the way." },
  { name: "Vikram P.", location: "Pune", date: "Oct 2024", rating: 4, text: "Outstanding quality and presentation. The chocolate shavings on top give it such a premium finish. Delivery was prompt and packaging superb." },
];

function StarRating({ count }: { count: number }) {
  return (
    <span style={{ color: "#B8860B", fontSize: "1rem", letterSpacing: "0.05em" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0.25 }}>★</span>
      ))}
    </span>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const paramImg   = searchParams.get("img")   ? decodeURIComponent(searchParams.get("img")!)   : null;
  const paramName  = searchParams.get("name")  ? decodeURIComponent(searchParams.get("name")!)  : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price"))                : null;

  const displayImg   = paramImg ?? "/product-1.jpg";
  const displayName  = paramName  ?? "The Classic Fudge Cake";
  const basePrice    = paramPrice && paramPrice > 0 ? paramPrice : 1250;

  const { addItem } = (useCart() ?? { addItem: () => {} }) as { addItem: (item: { id: string; name: string; price: number; quantity: number; image: string }) => void };
  const router = useRouter();

  const [selectedImg, setSelectedImg]       = useState(displayImg);
  const [selectedSize, setSelectedSize]     = useState(SIZES[1]);
  const [quantity, setQuantity]             = useState(1);
  const [customMsg, setCustomMsg]           = useState("");
  const [addedState, setAddedState]         = useState(false);
  const [showToast, setShowToast]           = useState(false);
  const [toastMsg, setToastMsg]             = useState("");
  const [lightbox, setLightbox]             = useState(false);
  const [lightboxIdx, setLightboxIdx]       = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [email, setEmail]                   = useState("");
  const [emailSent, setEmailSent]           = useState(false);

  const thumbs = [displayImg, ...PRODUCTS.filter(p => p.img !== displayImg).slice(0, 3).map(p => p.img)];
  const totalPrice = basePrice + SIZE_PRICE[selectedSize];

  const galleryRef = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);
  const [galleryStyle, setGalleryStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,700&family=Source+Sans+3:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!galleryRef.current || !infoRef.current) return;
      const galleryRect = galleryRef.current.getBoundingClientRect();
      const infoRect    = infoRef.current.getBoundingClientRect();
      const galleryH    = galleryRef.current.offsetHeight;
      const infoH       = infoRef.current.offsetHeight;
      if (window.innerWidth < 768) { setGalleryStyle({}); return; }
      if (infoH <= galleryH) { setGalleryStyle({}); return; }
      const parentTop = infoRef.current.parentElement?.getBoundingClientRect().top ?? 0;
      const navHeight = 72;
      if (galleryRect.top <= navHeight && infoRect.bottom > galleryH + navHeight) {
        setGalleryStyle({ position: "sticky", top: `${navHeight}px` });
      } else {
        setGalleryStyle({});
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = "1";
          (entry.target as HTMLElement).style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(24px)";
      (el as HTMLElement).style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (addedState) return;
    addItem({ id: `product-${Date.now()}`, name: displayName, price: totalPrice * quantity, quantity, image: displayImg });
    setAddedState(true);
    setToastMsg(`${displayName} added to cart.`);
    setShowToast(true);
    setTimeout(() => setAddedState(false), 1500);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    addItem({ id: `product-${Date.now()}`, name: displayName, price: totalPrice * quantity, quantity, image: displayImg });
    router.push("/checkout");
  };

  const navBg = scrolled ? "rgba(17,13,8,0.97)" : "transparent";
  const navBorder = scrolled ? "1px solid rgba(107,90,74,0.3)" : "none";

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif" }}>

      {/* NAVIGATION */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, borderBottom: navBorder, transition: "background 0.25s ease, border-bottom 0.25s ease", padding: "0 48px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => router.push("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.08)" }}>
            <img src="/logo.png" alt="Tier Chocolate logo" style={{ height: "40px", objectFit: "contain" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "40px", listStyle: "none" }} className="desktop-nav">
          {[["Our Cakes", "/shop"], ["Seasonal", "/shop"], ["The Story", "/"], ["Gifting", "/shop"]].map(([label, path]) => (
            <button key={label} onClick={() => router.push(path)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "0.9375rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, padding: "4px 0", position: "relative", transition: "color 0.2s" }}
              onMouseEnter={e => { const el = e.currentTarget.querySelector(".nav-underline") as HTMLElement; if (el) { el.style.width = "100%"; el.style.left = "0"; } }}
              onMouseLeave={e => { const el = e.currentTarget.querySelector(".nav-underline") as HTMLElement; if (el) { el.style.width = "0"; el.style.left = "50%"; } }}>
              {label}
              <span className="nav-underline" style={{ position: "absolute", bottom: 0, left: "50%", width: 0, height: "1px", background: "#B8860B", transition: "width 0.2s ease, left 0.2s ease" }} />
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => router.push("/checkout")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#B8860B")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          </button>
          <button onClick={() => setMobileMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", padding: "8px", display: "none" }} className="hamburger-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)" }} onClick={() => setMobileMenuOpen(false)}>
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "85vw", maxWidth: "360px", background: "#1C1410", padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setMobileMenuOpen(false)} style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", color: "var(--text)", marginBottom: "16px" }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {[["Our Cakes", "/shop"], ["Seasonal", "/shop"], ["The Story", "/"], ["Gifting", "/shop"]].map(([label, path]) => (
              <button key={label} onClick={() => { router.push(path); setMobileMenuOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "1.25rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, padding: "16px 8px", textAlign: "left", borderBottom: "1px solid rgba(107,90,74,0.2)", height: "56px", display: "flex", alignItems: "center" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MAIN PRODUCT SECTION */}
      <div style={{ paddingTop: "72px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 48px 96px", display: "grid", gridTemplateColumns: "55% 45%", gap: "64px", alignItems: "start" }} className="product-grid">

          {/* LEFT: STICKY GALLERY */}
          <div ref={galleryRef} style={galleryStyle}>
            {/* Main image */}
            <div style={{ overflow: "hidden", borderRadius: "16px", background: "#1C1410", cursor: "zoom-in", position: "relative", boxShadow: "0 20px 60px rgba(140,28,29,0.15)" }}
              onClick={() => { setLightboxIdx(thumbs.indexOf(selectedImg)); setLightbox(true); }}>
              <img src={selectedImg} alt={displayName} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
              <div style={{ position: "absolute", bottom: "16px", right: "16px", background: "rgba(17,13,8,0.7)", borderRadius: "8px", padding: "6px 10px", display: "flex", alignItems: "center", gap: "6px", backdropFilter: "blur(4px)" }}>
                <svg width="16" height="16" fill="none" stroke="#F5EFE8" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                <span style={{ fontSize: "0.75rem", color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif" }}>Expand</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
              {thumbs.map((t, i) => (
                <button key={i} onClick={() => setSelectedImg(t)} style={{ padding: 0, border: selectedImg === t ? "2px solid #B8860B" : "2px solid transparent", borderRadius: "8px", overflow: "hidden", cursor: "pointer", background: "none", flexShrink: 0, boxShadow: selectedImg === t ? "0 0 0 1px #B8860B" : "none", transition: "border 0.15s, box-shadow 0.15s" }}>
                  <img src={t} alt={`Thumbnail ${i + 1}`} style={{ width: "90px", height: "90px", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>

            {/* VISUAL FINGERPRINT — Artisanal Product Story Overlay */}
            <div className="reveal" style={{ marginTop: "40px", position: "relative", background: "linear-gradient(135deg, #1C1410 0%, #2A1810 100%)", borderRadius: "16px", padding: "32px", overflow: "hidden" }}
              onMouseEnter={e => { (e.currentTarget.querySelector(".story-inner") as HTMLElement).style.transform = "perspective(1000px) rotateY(-2deg) translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget.querySelector(".story-inner") as HTMLElement).style.transform = "perspective(1000px) rotateY(0deg) translateY(0)"; }}>
              <div className="story-inner" style={{ transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)", display: "flex", gap: "24px", alignItems: "center" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: "120px", height: "120px", borderRadius: "12px", overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.35)", transform: "translateY(-8px) translateX(6px)" }}>
                    <img src={displayImg} alt="Story image of cake" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <svg width="140" height="140" style={{ position: "absolute", top: "-16px", left: "-10px", pointerEvents: "none" }} viewBox="0 0 140 140">
                    <defs>
                      <path id="curve-path" d="M 70,70 m -50,0 a 50,50 0 1,1 100,0" />
                    </defs>
                    <text fill="#B8860B" fontSize="10" fontFamily="'Playfair Display', serif" fontStyle="italic" letterSpacing="1.5">
                      <textPath href="#curve-path">The Classic Fudge &nbsp; · &nbsp; Handcrafted &nbsp; · &nbsp;</textPath>
                    </text>
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "1rem", color: "#B8860B", marginBottom: "8px", letterSpacing: "0.02em" }}>Artisan's Note</p>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: "240px" }}>Each cake is layered and frosted by hand, finished with hand-piped rosettes and chocolate shavings sourced from single-origin cacao.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div ref={infoRef} style={{ display: "flex", flexDirection: "column", gap: "24px", paddingTop: "16px" }}>
            {/* Eyebrow */}
            <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>Signature Collection · Tier Chocolate</span>

            {/* Name */}
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem,4.5vw,3.5rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05, color: "var(--text)", margin: 0 }}>{displayName}</h1>

            {/* Rating + trust */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <StarRating count={5} />
              <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>4.9 (248 reviews)</span>
              <span style={{ fontSize: "0.75rem", background: "rgba(184,134,11,0.12)", color: "#B8860B", padding: "4px 10px", borderRadius: "9999px", fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif" }}>Made in India</span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.875rem", fontWeight: 700, color: "#B8860B", transition: "opacity 0.15s ease" }}>₹{(totalPrice * quantity).toLocaleString("en-IN")}</span>
              <span style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>incl. of all taxes</span>
            </div>

            {/* Free shipping */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(140,28,29,0.12)", borderRadius: "8px", padding: "12px 16px", border: "1px solid rgba(140,28,29,0.25)" }}>
              <svg width="18" height="18" fill="none" stroke="#B8860B" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <span style={{ fontSize: "0.875rem", color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif" }}>Free delivery on orders above ₹999</span>
            </div>

            {/* Description */}
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", margin: 0 }}>{PRODUCTS.find(p => p.img === displayImg)?.description ?? "A decadent handcrafted cake, made with premium ingredients and finished with artisanal detail."}</p>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(107,90,74,0.25)" }} />

            {/* Size selector */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text)", marginBottom: "10px", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.12em" }}>Size</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)} style={{ padding: "8px 16px", borderRadius: "8px", border: selectedSize === s ? "2px solid #B8860B" : "1px solid rgba(107,90,74,0.4)", background: selectedSize === s ? "rgba(184,134,11,0.12)" : "transparent", color: selectedSize === s ? "#B8860B" : "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.875rem", fontWeight: selectedSize === s ? 600 : 400, cursor: "pointer", transition: "all 0.18s ease" }}>
                    {s}
                  </button>
                ))}
              </div>
              {SIZE_PRICE[selectedSize] > 0 && <span style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: "6px", display: "block", fontFamily: "'Source Sans 3', sans-serif" }}>+₹{SIZE_PRICE[selectedSize].toLocaleString("en-IN")} for this size</span>}
            </div>

            {/* Quantity */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text)", marginBottom: "10px", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.12em" }}>Quantity</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0", border: "1px solid rgba(107,90,74,0.4)", borderRadius: "8px", overflow: "hidden", width: "fit-content" }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: "44px", height: "44px", background: "rgba(107,90,74,0.15)", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(107,90,74,0.3)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(107,90,74,0.15)")}>−</button>
                <span style={{ width: "52px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "var(--text)", background: "transparent" }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: "44px", height: "44px", background: "rgba(107,90,74,0.15)", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(107,90,74,0.3)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(107,90,74,0.15)")}>+</button>
              </div>
            </div>

            {/* Custom message */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text)", marginBottom: "10px", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.12em" }}>Custom Message <span style={{ fontWeight: 400, textTransform: "none", color: "var(--muted)", letterSpacing: 0 }}>(optional)</span></label>
              <textarea value={customMsg} onChange={e => setCustomMsg(e.target.value)} placeholder="e.g. Happy Birthday, Meera! Wishing you all the sweetness…" rows={3}
                style={{ width: "100%", padding: "12px 16px", background: "rgba(107,90,74,0.1)", border: "1px solid rgba(107,90,74,0.35)", borderRadius: "8px", color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box", minHeight: "96px" }}
                onFocus={e => (e.target.style.border = "1px solid #B8860B")} onBlur={e => (e.target.style.border = "1px solid rgba(107,90,74,0.35)")} />
            </div>

            {/* CTA Buttons — desktop */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="cta-desktop">
              <button onClick={handleAddToCart}
                style={{ width: "100%", height: "60px", background: "#B8860B", border: "none", borderRadius: "8px", color: "#fff", fontSize: "1.125rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s, background 0.2s", boxShadow: "0 8px 24px rgba(184,134,11,0.3)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "#9A7009"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#B8860B"; }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
                {addedState ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button onClick={handleBuyNow}
                style={{ width: "100%", height: "60px", background: "var(--primary)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "1.125rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, cursor: "pointer", transition: "transform 0.2s, background 0.2s", boxShadow: "0 8px 24px rgba(140,28,29,0.3)" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.background = "#721617"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "var(--primary)"; }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}>
                Order Your Cake
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", paddingTop: "8px" }}>
              {[
                { icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: "Secure Payment" },
                { icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Made Fresh Daily" },
                { icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: "Same Day Delivery" },
              ].map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--muted)", fontSize: "0.8125rem", fontFamily: "'Source Sans 3', sans-serif" }}>
                  <span style={{ color: "#B8860B" }}>{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(107,90,74,0.25)" }} />

            {/* Ingredients highlight */}
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.25rem", fontWeight: 600, color: "var(--text)", marginBottom: "16px" }}>What's Inside</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["Belgian Cocoa", "Fresh Butter", "Free-Range Eggs", "Dark Valrhona Chocolate", "Artisanal Sugar", "Pinch of Sea Salt"].map(tag => (
                  <span key={tag} style={{ padding: "6px 12px", background: "rgba(107,90,74,0.15)", borderRadius: "9999px", fontSize: "0.8125rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", border: "1px solid rgba(107,90,74,0.25)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BAKER'S PROMISE SECTION */}
      <section className="reveal" style={{ background: "#1C1410", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }} className="split-section">
          <div style={{ overflow: "hidden", borderRadius: "16px", boxShadow: "0 24px 64px rgba(140,28,29,0.2)" }}>
            <img src="/product-1.jpg" alt="Hands crafting a chocolate cake" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", filter: "sepia(0.2) brightness(0.9)", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>Our Philosophy</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", margin: 0 }}>Our Dedication to Excellence</h2>
            <div style={{ width: "32px", height: "2px", background: "#B8860B", borderRadius: "2px" }} />
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", margin: 0 }}>At Tier Chocolate, every cake is a labour of love, crafted by hand using premium Belgian cocoa, fresh-churned butter, and single-origin dark chocolate. We source our ingredients with the same care we apply to every piped rosette and layered sponge.</p>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", margin: 0 }}>No artificial preservatives. No shortcuts. Just the honest craft of a skilled patissier who believes the best cakes tell a story in every bite.</p>
            <button onClick={() => router.push("/shop")} style={{ alignSelf: "flex-start", padding: "14px 32px", background: "transparent", border: "1px solid rgba(184,134,11,0.5)", borderRadius: "8px", color: "#B8860B", fontSize: "0.9375rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(184,134,11,0.1)"; e.currentTarget.style.borderColor = "#B8860B"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(184,134,11,0.5)"; }}>
              Explore All Cakes
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="reveal" style={{ background: "var(--bg)", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>Moments of Delight</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "var(--text)", marginTop: "12px" }}>What Our Guests Say</h2>
          </div>

          {/* Large hero testimonial */}
          <div style={{ background: "#1C1410", borderRadius: "20px", padding: "56px", marginBottom: "40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-20px", left: "50%", transform: "translateX(-50%)", fontSize: "8rem", color: "rgba(184,134,11,0.06)", fontFamily: "serif", lineHeight: 1, pointerEvents: "none" }}>"</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "clamp(1.25rem,2.5vw,1.75rem)", color: "var(--text)", lineHeight: 1.5, letterSpacing: "-0.01em", maxWidth: "700px", margin: "0 auto 24px", position: "relative", zIndex: 1 }}>
              "Absolutely divine! The perfect centrepiece for our anniversary celebration. Every bite was pure indulgence — the chocolate depth and the lightness of the sponge is something I've never tasted before."
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}><StarRating count={5} /></div>
            <p style={{ fontSize: "0.9375rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>— Rina S., Mumbai</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }} className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <div key={i} className="reveal" style={{ background: "#1A110C", borderRadius: "16px", padding: "32px", border: "1px solid rgba(107,90,74,0.2)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(140,28,29,0.2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "var(--text)", fontSize: "1rem", marginBottom: "2px" }}>{r.name}</p>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8125rem", color: "var(--muted)" }}>{r.location} · {r.date}</p>
                  </div>
                  <StarRating count={r.rating} />
                </div>
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", margin: 0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="reveal" style={{ background: "#1C1410", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "56px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", display: "block", marginBottom: "10px" }}>You May Also Love</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.75rem,3.5vw,2.5rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)", margin: 0 }}>More from Our Patisserie</h2>
            </div>
            <button onClick={() => router.push("/shop")} style={{ background: "none", border: "1px solid rgba(184,134,11,0.4)", borderRadius: "8px", padding: "10px 24px", color: "#B8860B", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(184,134,11,0.1)"; e.currentTarget.style.borderColor = "#B8860B"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "rgba(184,134,11,0.4)"; }}>
              View All
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }} className="related-grid">
            {PRODUCTS.filter(p => p.img !== displayImg).slice(0, 3).map((p, i) => {
              const displayPrice = p.price > 0 ? p.price : 1250;
              return (
                <article key={p.id} className="reveal" style={{ cursor: "pointer", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)", animationDelay: `${i * 100}ms` }}
                  onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${displayPrice}&img=${encodeURIComponent(p.img)}`)}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(140,28,29,0.25)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <div style={{ overflow: "hidden", borderRadius: "12px", background: "#1A110C", marginBottom: "20px" }}>
                    <img src={p.img} alt={p.name} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", display: "block", transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.125rem", fontWeight: 600, color: "var(--text)", marginBottom: "8px" }}>{p.name}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", marginBottom: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#B8860B", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: "1.125rem" }}>₹{displayPrice.toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: "0.8125rem", color: "#B8860B", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, textDecoration: "underline", textDecorationColor: "transparent", transition: "text-decoration-color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.textDecorationColor = "#B8860B")} onMouseLeave={e => (e.currentTarget.style.textDecorationColor = "transparent")}>
                      View Details →
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0D0905", padding: "80px 48px 40px", borderTop: "1px solid rgba(107,90,74,0.2)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", gap: "32px", marginBottom: "56px" }} className="footer-grid">
            {/* Col 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", alignSelf: "flex-start" }}>
                <img src="/logo.png" alt="Tier Chocolate logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85 }} />
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65, maxWidth: "240px" }}>Crafting moments of pure indulgence — one handcrafted cake at a time.</p>
              <div style={{ display: "flex", gap: "16px" }}>
                {[
                  { name: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { name: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                ].map(social => (
                  <button key={social.name} onClick={() => window.open("https://www.instagram.com", "_blank")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: "4px", borderRadius: "4px", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#B8860B")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={social.path} /></svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, marginBottom: "16px" }}>Shop</h4>
              {["Our Cakes", "Seasonal", "Gift Cards", "Wholesale"].map(link => (
                <button key={link} onClick={() => router.push("/shop")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", padding: "6px 0", textAlign: "left", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                  {link}
                </button>
              ))}
            </div>

            {/* Col 3 */}
            <div>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, marginBottom: "16px" }}>Learn</h4>
              {["Our Story", "Ingredient Sourcing", "Press", "FAQ"].map(link => (
                <button key={link} onClick={() => router.push("/")} style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", padding: "6px 0", textAlign: "left", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                  {link}
                </button>
              ))}
            </div>

            {/* Col 4: Newsletter */}
            <div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.125rem", fontWeight: 600, color: "var(--text)", marginBottom: "16px" }}>Stay in the loop</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65, marginBottom: "20px" }}>Get early access to seasonal specials, baking notes, and exclusive offers.</p>
              {emailSent ? (
                <div style={{ padding: "14px 20px", background: "rgba(184,134,11,0.15)", border: "1px solid rgba(184,134,11,0.4)", borderRadius: "8px", color: "#B8860B", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", fontWeight: 600, textAlign: "center" }}>
                  ✓ You're on the list!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" style={{ height: "48px", padding: "0 16px", background: "rgba(107,90,74,0.1)", border: "1px solid rgba(107,90,74,0.35)", borderRadius: "8px", color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => (e.target.style.border = "1px solid #B8860B")} onBlur={e => (e.target.style.border = "1px solid rgba(107,90,74,0.35)")} />
                  <button onClick={() => { if (email.includes("@")) { setEmailSent(true); } }}
                    style={{ height: "48px", background: "#B8860B", border: "none", borderRadius: "8px", color: "#fff", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#9A7009")} onMouseLeave={e => (e.currentTarget.style.background = "#B8860B")}>
                    Subscribe
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(107,90,74,0.2)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>
              © 2026 Tier Chocolate ·{" "}
              <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "0.8125rem", fontFamily: "'Source Sans 3', sans-serif", padding: 0, textDecoration: "underline" }}>Privacy Policy</button>
              {" "}·{" "}
              <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "0.8125rem", fontFamily: "'Source Sans 3', sans-serif", padding: 0, textDecoration: "underline" }}>Terms of Service</button>
            </p>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {["VISA", "MC", "AMEX", "UPI"].map(method => (
                <div key={method} style={{ padding: "4px 10px", background: "rgba(107,90,74,0.2)", borderRadius: "6px", fontSize: "0.6875rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, letterSpacing: "0.05em", border: "1px solid rgba(107,90,74,0.2)" }}>{method}</div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX */}
      {lightbox && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setLightbox(false)}>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + thumbs.length) % thumbs.length); }} style={{ position: "absolute", left: "24px", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", width: "48px", height: "48px", borderRadius: "50%", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>‹</button>
          <img src={thumbs[lightboxIdx]} alt="Full size product view" style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: "12px" }} onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % thumbs.length); }} style={{ position: "absolute", right: "24px", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", width: "48px", height: "48px", borderRadius: "50%", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>›</button>
          <button onClick={() => setLightbox(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", width: "40px", height: "40px", borderRadius: "50%", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div style={{ position: "fixed", bottom: "100px", right: "24px", zIndex: 250, transform: showToast ? "translateY(0)" : "translateY(120%)", opacity: showToast ? 1 : 0, transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease", background: "#1C1410", border: "1px solid rgba(184,134,11,0.4)", borderRadius: "12px", padding: "14px 20px", minWidth: "240px", boxShadow: "0 16px 48px rgba(0,0,0,0.4)" }}>
        <p style={{ margin: 0, fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9375rem", color: "var(--text)", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#B8860B", fontSize: "1.1rem" }}>✓</span>
          {toastMsg}
        </p>
      </div>

      {/* STICKY MOBILE BOTTOM BAR */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 150, background: "rgba(17,13,8,0.97)", borderTop: "1px solid rgba(107,90,74,0.3)", padding: "12px 20px", display: "flex", gap: "12px", alignItems: "center", backdropFilter: "blur(12px)" }} className="mobile-bottom-bar">
        <div>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>Total</p>
          <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#B8860B", fontFamily: "'Source Sans 3', sans-serif" }}>₹{(totalPrice * quantity).toLocaleString("en-IN")}</p>
        </div>
        <button onClick={handleAddToCart} style={{ flex: 1, height: "52px", background: "#B8860B", border: "none", borderRadius: "8px", color: "#fff", fontSize: "1rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, cursor: "pointer", transition: "transform 0.2s, background 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#9A7009")} onMouseLeave={e => (e.currentTarget.style.background = "#B8860B")}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
          {addedState ? "✓ Added to Cart" : "Add to Cart"}
        </button>
        <button onClick={handleBuyNow} style={{ flex: 1, height: "52px", background: "var(--primary)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "1rem", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, cursor: "pointer", transition: "transform 0.2s" }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")} onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
          Order Now
        </button>
      </div>

      {/* RESPONSIVE + MOBILE STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 32px 20px 120px !important; }
          .split-section { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: 1fr !important; }
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .cta-desktop { display: none !important; }
          .mobile-bottom-bar { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-bottom-bar { display: none !important; }
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .product-grid { padding: 48px 32px 96px !important; }
        }
        *:focus-visible { outline: 2px solid #B8860B; outline-offset: 3px; border-radius: 4px; }
        ::placeholder { color: var(--muted); }
        ::selection { background: rgba(184,134,11,0.25); color: var(--text); }
      `}</style>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}