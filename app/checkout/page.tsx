"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], clearCart } = useCart() ?? {};

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal-anim").forEach((el) => {
      el.classList.add("reveal-hidden");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pin.trim() || !/^\d{6}$/.test(form.pin))
      newErrors.pin = "Enter a valid 6-digit PIN code";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const order = await res.json();

      const options = {
        key: "rzp_test_",
        amount: order.amount,
        currency: "INR",
        name: "Tier Chocolate",
        description: "Handcrafted luxury desserts",
        handler: () => {
          clearCart && clearCart();
          router.push("/");
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#8C1C1D" },
      };

      const win = window as any;
      if (win.Razorpay) {
        const rzp = new win.Razorpay(options);
        rzp.open();
      } else {
        clearCart && clearCart();
        router.push("/");
      }
    } catch {
      clearCart && clearCart();
      router.push("/");
    } finally {
      setPlacing(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "8px",
    border: errors[field] ? "1.5px solid #C0392B" : "1.5px solid #2A1A0E",
    background: "#1C1008",
    color: "var(--text)",
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: "15px",
    lineHeight: 1.5,
    outline: "none",
    transition: "border-color 200ms ease",
    boxSizing: "border-box",
  });

  const navLinks = [
    { label: "Our Cakes", action: () => router.push("/shop") },
    { label: "Seasonal", action: () => router.push("/shop") },
    { label: "The Story", action: () => router.push("/") },
    { label: "Gifting", action: () => router.push("/shop") },
  ];

  if (items.length === 0) {
    return (
      <>
        <style>{`
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
          body { background: var(--bg); color: var(--text); font-family: 'Source Sans 3', sans-serif; }
          .reveal-hidden { opacity: 0; transform: translateY(24px); transition: opacity 600ms ease-out, transform 600ms ease-out; }
          .reveal-visible { opacity: 1; transform: translateY(0); }
        `}</style>
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          background: scrolled ? "#1C1008" : "transparent",
          borderBottom: scrolled ? "1px solid #2A1A0E" : "none",
          transition: "background 250ms ease, border 250ms ease",
          padding: "0 48px",
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)" }}>
              <img src="/logo.png" alt="Tier Chocolate logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
            </div>
            <button onClick={() => router.push("/checkout")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", position: "relative" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </button>
          </div>
        </nav>
        <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", padding: "96px 24px" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6B5A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>Your cart is empty</h2>
          <p style={{ color: "var(--muted)", fontSize: "16px", textAlign: "center", maxWidth: "360px", lineHeight: 1.7 }}>Discover our handcrafted collection of luxury desserts and find something indulgent.</p>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
            style={{
              padding: "16px 40px", borderRadius: "12px", border: "none", cursor: "pointer",
              background: "var(--primary)", color: "var(--text)",
              fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "16px",
              boxShadow: "0 10px 30px -10px #8C1C1D60",
              transition: "transform 200ms ease, box-shadow 200ms ease",
            }}
          >
            Start Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
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
        body { background: var(--bg); color: var(--text); font-family: 'Source Sans 3', sans-serif; }
        .reveal-hidden { opacity: 0; transform: translateY(24px); transition: opacity 600ms ease-out, transform 600ms ease-out; }
        .reveal-visible { opacity: 1; transform: translateY(0); }
        .checkout-input:focus { border-color: #B8860B !important; outline: none; }
        .checkout-input::placeholder { color: #4A3828; }
        .nav-link { color: var(--text); text-decoration: none; font-family: 'Source Sans 3', sans-serif; font-size: 15px; font-weight: 600; position: relative; transition: color 200ms ease; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%); width: 0; height: 1px; background: #B8860B; transition: width 200ms ease; }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #B8860B; }
        @media (max-width: 900px) {
          .checkout-grid { flex-direction: column !important; }
          .checkout-form-col { width: 100% !important; }
          .checkout-summary-col { width: 100% !important; }
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 901px) {
          .nav-hamburger { display: none !important; }
        }
        @media (max-width: 600px) {
          .checkout-section { padding: 64px 20px !important; }
        }
        :focus-visible { outline: 2px solid #B8860B; outline-offset: 2px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "#1A0F08" : "transparent",
        borderBottom: scrolled ? "1px solid #2A1A0E" : "none",
        transition: "background 250ms ease, border 250ms ease",
        padding: "0 48px",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ padding: "4px 8px", borderRadius: "8px", background: "rgba(255,255,255,0.06)" }}>
            <img src="/logo.png" alt="Tier Chocolate logo" style={{ height: "40px", objectFit: "contain", cursor: "pointer" }} onClick={() => router.push("/")} />
          </div>

          <div className="nav-links-desktop" style={{ display: "flex", gap: "36px", alignItems: "center" }}>
            {navLinks.map((link) => (
              <button key={link.label} onClick={link.action} className="nav-link" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                {link.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => router.push("/checkout")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", position: "relative", padding: "4px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {items.length > 0 && (
                <span style={{
                  position: "absolute", top: "-4px", right: "-4px",
                  background: "#B8860B", color: "#fff",
                  borderRadius: "9999px", width: "18px", height: "18px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", fontWeight: 600,
                }}>
                  {items.reduce((s, i) => s + (i.quantity ?? 1), 0)}
                </span>
              )}
            </button>

            <button
              className="nav-hamburger"
              onClick={() => setMobileNavOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", display: "none", flexDirection: "column", gap: "5px", padding: "4px" }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: "block", width: "24px", height: "2px", background: "var(--text)", borderRadius: "2px", transition: "transform 280ms ease-in-out" }} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV OVERLAY */}
      {mobileNavOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.7)" }} onClick={() => setMobileNavOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: "85vw", maxWidth: "340px",
            background: "#1C1008", display: "flex", flexDirection: "column", padding: "32px 24px",
            animation: "slideInLeft 350ms ease-out",
          }}>
            <button onClick={() => setMobileNavOpen(false)} style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", color: "var(--text)", marginBottom: "32px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {navLinks.map(link => (
              <button key={link.label} onClick={() => { link.action(); setMobileNavOpen(false); }} style={{
                background: "none", border: "none", cursor: "pointer", color: "var(--text)",
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "20px", fontWeight: 600,
                textAlign: "left", padding: "0", height: "56px", display: "flex", alignItems: "center",
                borderBottom: "1px solid #2A1A0E",
              }}>
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CHECKOUT HERO BAR */}
      <div style={{ background: "#1A0F08", borderBottom: "1px solid #2A1A0E", padding: "32px 48px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "#B8860B", fontFamily: "'Source Sans 3', sans-serif" }}>
            Secure Checkout
          </span>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text)",
            lineHeight: 1.1,
            marginTop: "8px",
          }}>
            Complete Your Order
          </h1>
          {/* Trust bar */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "16px" }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: "SSL Encrypted" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Free delivery above ₹500" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>, text: "Handcrafted in India" },
            ].map((trust, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {trust.icon}
                <span style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>{trust.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CHECKOUT SECTION */}
      <section className="checkout-section reveal-anim" style={{ padding: "64px 48px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="checkout-grid" style={{ display: "flex", gap: "48px", alignItems: "flex-start" }}>

            {/* LEFT: FORM */}
            <div className="checkout-form-col" style={{ flex: "1.4", minWidth: 0 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "32px" }}>
                Delivery Details
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Full Name *
                  </label>
                  <input
                    className="checkout-input"
                    type="text"
                    placeholder="Riya Sharma"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={inputStyle("name")}
                  />
                  {errors.name && <p style={{ marginTop: "6px", fontSize: "13px", color: "#E07070", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.name}</p>}
                </div>

                {/* Email + Phone */}
                <div className="form-row">
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Email Address *
                    </label>
                    <input
                      className="checkout-input"
                      type="email"
                      placeholder="riya@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={inputStyle("email")}
                    />
                    {errors.email && <p style={{ marginTop: "6px", fontSize: "13px", color: "#E07070", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Phone Number *
                    </label>
                    <input
                      className="checkout-input"
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
                      style={inputStyle("phone")}
                    />
                    {errors.phone && <p style={{ marginTop: "6px", fontSize: "13px", color: "#E07070", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.phone}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Street Address *
                  </label>
                  <input
                    className="checkout-input"
                    type="text"
                    placeholder="123, Park Street, Bandra West"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    style={inputStyle("address")}
                  />
                  {errors.address && <p style={{ marginTop: "6px", fontSize: "13px", color: "#E07070", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.address}</p>}
                </div>

                {/* City + State */}
                <div className="form-row">
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      City *
                    </label>
                    <input
                      className="checkout-input"
                      type="text"
                      placeholder="Mumbai"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      style={inputStyle("city")}
                    />
                    {errors.city && <p style={{ marginTop: "6px", fontSize: "13px", color: "#E07070", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.city}</p>}
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      State *
                    </label>
                    <input
                      className="checkout-input"
                      type="text"
                      placeholder="Maharashtra"
                      value={form.state}
                      onChange={e => setForm({ ...form, state: e.target.value })}
                      style={inputStyle("state")}
                    />
                    {errors.state && <p style={{ marginTop: "6px", fontSize: "13px", color: "#E07070", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.state}</p>}
                  </div>
                </div>

                {/* PIN */}
                <div style={{ maxWidth: "240px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    PIN Code *
                  </label>
                  <input
                    className="checkout-input"
                    type="text"
                    placeholder="400050"
                    maxLength={6}
                    value={form.pin}
                    onChange={e => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })}
                    style={inputStyle("pin")}
                  />
                  {errors.pin && <p style={{ marginTop: "6px", fontSize: "13px", color: "#E07070", fontFamily: "'Source Sans 3', sans-serif" }}>{errors.pin}</p>}
                </div>

                {/* Delivery Note */}
                <div style={{
                  background: "#1C1008",
                  border: "1px solid #2A1A0E",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.6, fontFamily: "'Source Sans 3', sans-serif" }}>
                    All cakes are freshly baked and dispatched within 24–48 hours. Refrigerate upon arrival. Best consumed within 3 days.
                  </p>
                </div>

                {/* Payment Methods */}
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                    Accepted Payment Methods
                  </p>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    {["UPI", "Visa", "Mastercard", "Net Banking", "COD"].map(method => (
                      <span key={method} style={{
                        padding: "6px 14px",
                        borderRadius: "9999px",
                        border: "1px solid #2A1A0E",
                        fontSize: "12px",
                        color: "var(--muted)",
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontWeight: 500,
                        background: "#1C1008",
                      }}>
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="checkout-summary-col" style={{ flex: "1", minWidth: 0 }}>
              <div style={{
                background: "#1A0F08",
                border: "1px solid #2A1A0E",
                borderRadius: "16px",
                padding: "32px",
                position: "sticky",
                top: "88px",
              }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "24px" }}>
                  Order Summary
                </h2>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  {items.map((item) => {
                    const itemPrice = (item.price ?? 0) * (item.quantity ?? 1);
                    return (
                      <div key={item.id} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ overflow: "hidden", borderRadius: "10px", flexShrink: 0, width: "72px", height: "72px" }}>
                          <img
                            src={item.image || "/product-1.jpg"}
                            alt={item.name}
                            style={{ width: "72px", height: "72px", objectFit: "cover", display: "block" }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.name}
                          </p>
                          <p style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", marginTop: "4px" }}>
                            Qty: {item.quantity ?? 1}
                          </p>
                        </div>
                        <p style={{ fontSize: "15px", fontWeight: 600, color: "#B8860B", fontFamily: "'Source Sans 3', sans-serif", flexShrink: 0 }}>
                          ₹{itemPrice.toLocaleString("en-IN")}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "#2A1A0E", marginBottom: "24px" }} />

                {/* Price Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "15px", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>Subtotal</span>
                    <span style={{ fontSize: "15px", color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500 }}>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "15px", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>Delivery</span>
                    {shipping === 0 ? (
                      <span style={{ fontSize: "15px", color: "#4CAF7D", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500 }}>FREE</span>
                    ) : (
                      <span style={{ fontSize: "15px", color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500 }}>₹{shipping.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                  {shipping > 0 && (
                    <div style={{ background: "#1C1008", borderRadius: "8px", padding: "10px 14px", border: "1px dashed #2A1A0E" }}>
                      <p style={{ fontSize: "12px", color: "#B8860B", fontFamily: "'Source Sans 3', sans-serif" }}>
                        Add ₹{(500 - subtotal).toLocaleString("en-IN")} more to get FREE delivery
                      </p>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "#2A1A0E", marginBottom: "20px" }} />

                {/* Total */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>Total</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#B8860B" }}>₹{total.toLocaleString("en-IN")}</span>
                </div>

                {/* CTA */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  onMouseEnter={e => { if (!placing) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                  onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)"; }}
                  onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
                  style={{
                    width: "100%",
                    height: "60px",
                    borderRadius: "12px",
                    border: "none",
                    cursor: placing ? "not-allowed" : "pointer",
                    background: placing ? "#6B5A4A" : "#B8860B",
                    color: "#fff",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontWeight: 600,
                    fontSize: "17px",
                    letterSpacing: "0.02em",
                    boxShadow: placing ? "none" : "0 10px 30px -10px #B8860B60",
                    transition: "transform 200ms ease, background 200ms ease, box-shadow 200ms ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {placing ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      Pay Now — ₹{total.toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                {/* Security note */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B5A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <p style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>
                    Secured by 256-bit SSL encryption
                  </p>
                </div>

                {/* Satisfaction guarantee */}
                <div style={{
                  marginTop: "20px",
                  background: "#1C1008",
                  border: "1px solid #2A1A0E",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, fontFamily: "'Source Sans 3', sans-serif" }}>
                    Freshness guaranteed. Not satisfied? We'll replace your order or issue a full refund.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0D0905", borderTop: "1px solid #2A1A0E", padding: "64px 48px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", paddingBottom: "48px" }}>
            {/* Col 1 */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <img src="/logo.png" alt="Tier Chocolate logo" style={{ height: "32px", objectFit: "contain", opacity: 0.85, alignSelf: "flex-start" }} />
              <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.7, fontFamily: "'Source Sans 3', sans-serif", maxWidth: "200px" }}>
                Crafting moments of pure indulgence
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)", transition: "color 200ms ease" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#B8860B")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text)", transition: "color 200ms ease" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#B8860B")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", marginBottom: "16px" }}>Shop</p>
              {["Our Cakes", "Seasonal", "Gift Cards", "Wholesale"].map(link => (
                <button key={link} onClick={() => router.push("/shop")} style={{
                  display: "block", background: "none", border: "none", cursor: "pointer",
                  color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px",
                  padding: "0 0 10px", textAlign: "left",
                  transition: "color 200ms ease",
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#B8860B")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>
                  {link}
                </button>
              ))}
            </div>

            {/* Col 3 */}
            <div>
              <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600, color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", marginBottom: "16px" }}>Learn</p>
              {["Our Story", "Ingredient Sourcing", "Press", "FAQ"].map(link => (
                <button key={link} onClick={() => router.push("/")} style={{
                  display: "block", background: "none", border: "none", cursor: "pointer",
                  color: "var(--text)", fontFamily: "'Source Sans 3', sans-serif", fontSize: "15px",
                  padding: "0 0 10px", textAlign: "left",
                  transition: "color 200ms ease",
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#B8860B")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}>
                  {link}
                </button>
              ))}
            </div>

            {/* Col 4 — Newsletter */}
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600, color: "var(--text)", marginBottom: "16px" }}>Stay in the loop</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Bottom strip */}
          <div style={{ borderTop: "1px solid #2A1A0E", padding: "24px 0 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <p style={{ fontSize: "13px", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif" }}>
              © 2026 Tier Chocolate ·{" "}
              <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "13px", fontFamily: "'Source Sans 3', sans-serif", textDecoration: "underline" }}>Privacy Policy</button>
              {" · "}
              <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "13px", fontFamily: "'Source Sans 3', sans-serif", textDecoration: "underline" }}>Terms of Service</button>
            </p>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              {["UPI", "Visa", "MC", "Amex"].map(p => (
                <span key={p} style={{
                  padding: "4px 10px", borderRadius: "6px", border: "1px solid #2A1A0E",
                  fontSize: "11px", color: "var(--muted)", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600,
                }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubscribe = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => { setEmail(e.target.value); if (status !== "idle") setStatus("idle"); }}
        style={{
          height: "48px", padding: "0 16px", borderRadius: "4px",
          border: status === "error" ? "1.5px solid #C0392B" : "1.5px solid #2A1A0E",
          background: "#1C1008", color: "var(--text)",
          fontFamily: "'Source Sans 3', sans-serif", fontSize: "14px",
          outline: "none",
        }}
      />
      {status === "success" && <p style={{ fontSize: "13px", color: "#4CAF7D", fontFamily: "'Source Sans 3', sans-serif" }}>You're on the list! 🎂</p>}
      {status === "error" && <p style={{ fontSize: "13px", color: "#E07070", fontFamily: "'Source Sans 3', sans-serif" }}>Please enter a valid email</p>}
      <button
        onClick={handleSubscribe}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        style={{
          height: "48px", borderRadius: "4px", border: "none", cursor: "pointer",
          background: "#B8860B", color: "#fff",
          fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "15px",
          transition: "transform 200ms ease, background 200ms ease",
        }}
      >
        Subscribe
      </button>
    </div>
  );
}