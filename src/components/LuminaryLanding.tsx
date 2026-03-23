import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import logoFull from "@/assets/logo-full.png";

const AUTH_URL = "https://luminary-diary.netlify.app/auth";

// ─── Animated Section Wrapper ───
const AnimatedSection = ({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
};

// ─── Glass Card ───
const GlassCard = ({ emoji, title, description, className = "" }: { emoji: string; title: string; description: string; className?: string }) => (
  <motion.div
    className={`glass-card rounded-xl p-6 md:p-8 group transition-all duration-300 hover:border-primary/30 ${className}`}
    whileHover={{ y: -6, boxShadow: "0 0 30px rgba(124, 58, 237, 0.2)" }}
  >
    <span className="text-3xl md:text-4xl block mb-4">{emoji}</span>
    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{description}</p>
  </motion.div>
);

// ─── Step Card ───
const StepCard = ({ emoji, step, title, description }: { emoji: string; step: string; title: string; description: string }) => (
  <motion.div
    className="glass-card rounded-xl p-6 text-center flex-1 min-w-[240px]"
    whileHover={{ y: -4, boxShadow: "0 0 25px rgba(124, 58, 237, 0.15)" }}
  >
    <span className="text-3xl block mb-3">{emoji}</span>
    <p className="text-xs font-medium text-primary uppercase tracking-widest mb-1">{step}</p>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
);

// ─── FEATURES DATA ───
const features = [
  { emoji: "✍️", title: "Write Without Limits", description: "No rules, no judgment. Just you and a blank page with a gentle nudge when you need it." },
  { emoji: "😊", title: "Feel It, Track It", description: "Pick your mood each day and watch your emotional journey unfold over time." },
  { emoji: "🔥", title: "Show Up Every Day", description: "Your streak is your superpower. Build a habit that becomes part of who you are." },
  { emoji: "🔒", title: "Yours Alone", description: "Your entries are private by default. Share only what you choose, when you choose." },
  { emoji: "🔍", title: "Find Any Memory", description: "Search by mood, tag, or keyword. Every memory is one tap away." },
  { emoji: "📊", title: "Understand Yourself", description: "Discover patterns in how you think and feel with beautiful mood charts." },
];

const steps = [
  { emoji: "📧", step: "Step 1", title: "Sign Up in Seconds", description: "No passwords needed. Just enter your email for a magic link — or sign in instantly with Google." },
  { emoji: "✍️", step: "Step 2", title: "Just Start Writing", description: "Open Luminary, pick a prompt or go free-form. No pressure, no rules." },
  { emoji: "😊", step: "Step 3", title: "Log How You Feel", description: "Choose your mood, add tags, and let Luminary remember the details for you." },
  { emoji: "✨", step: "Step 4", title: "Watch Yourself Grow", description: "Look back at your entries and discover how far you've come." },
];

const whyCards = [
  { emoji: "🎯", title: "Built with purpose", description: "Luminary was built by someone who wanted a journaling app that was actually beautiful, private, and easy to use every day." },
  { emoji: "🔒", title: "Privacy first", description: "Your entries are private by default. We don't read your journal, sell your data, or show you ads. Ever." },
  { emoji: "💜", title: "Free forever", description: "The core journaling experience is completely free. No paywalls, no credit card, no tricks." },
];

// ─── MAIN COMPONENT ───
const LuminaryLanding = () => {
  const [scrolled, setScrolled] = useState(false);
  const [bgColor, setBgColor] = useState("#0a0a0f");
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  // Scroll listener for navbar
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Intersection Observer for background transitions
  useEffect(() => {
    const sections = [
      { id: "hero", color: "#0a0a0f" },
      { id: "features", color: "#080812" },
      { id: "howit", color: "#0a0a0f" },
      { id: "why", color: "#0a0a0f" },
      { id: "cta", color: "#0d0520" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sections.find((s) => s.id === entry.target.id);
            if (section) setBgColor(section.color);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Vanta.js stars
  useEffect(() => {
    let mounted = true;
    const loadVanta = async () => {
      try {
        const STARS = (await import("vanta/dist/vanta.stars.min")).default;
        if (mounted && vantaRef.current && !vantaEffect.current) {
          const THREE = await import("three");
          vantaEffect.current = STARS({
            el: vantaRef.current,
            THREE,
            color: 0x7c3aed,
            backgroundColor: 0x0a0a0f,
            showDots: true,
            mouseControls: true,
            touchControls: false,
            minHeight: 600,
            minWidth: 200,
            scale: 1.0,
            scaleMobile: 1.0,
          });
        }
      } catch (e) {
        console.warn("Vanta.js could not load:", e);
      }
    };
    loadVanta();
    return () => {
      mounted = false;
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: bgColor, transition: "background-color 1.2s ease" }}
    >
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-card shadow-lg shadow-primary/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <img src={logoFull} alt="Luminary" className="h-8" />
          <div className="flex items-center gap-3">
            <a
              href={AUTH_URL}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg border border-transparent hover:border-border"
            >
              Sign In
            </a>
            <a
              href={AUTH_URL}
              className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2 rounded-lg glow-button"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16">
        <div ref={vantaRef} className="absolute inset-0 z-0" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground glass-card px-4 py-2 rounded-full mb-8">
              ✨ Now available on Android
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            The diary that
            <br />
            <span className="gradient-text">grows with you.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Capture your thoughts, understand your emotions, and become the best version of yourself — one entry at a time.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <a
              href={AUTH_URL}
              className="text-base font-semibold bg-primary text-primary-foreground px-8 py-3.5 rounded-xl glow-button"
            >
              Begin Your Journey →
            </a>
            <a
              href="#features"
              className="text-base font-medium text-muted-foreground border border-border px-8 py-3.5 rounded-xl hover:text-foreground hover:border-primary/40 transition-all"
            >
              See What's Inside ↓
            </a>
          </motion.div>

          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Free forever · No credit card · Available on Android
          </motion.p>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <AnimatedSection id="features" className="py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Built for the way you actually think and feel
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to journal consistently and understand yourself better.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <GlassCard {...f} />
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── HOW IT WORKS ── */}
      <AnimatedSection id="howit" className="py-24 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Getting started is easier than you think
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four simple steps to a journaling habit that actually lasts.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            {steps.map((s, i) => (
              <div key={s.step} className="flex flex-col md:flex-row items-center flex-1">
                <motion.div
                  className="flex-1 w-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <StepCard {...s} />
                </motion.div>
                {i < steps.length - 1 && (
                  <span className="text-muted-foreground text-xl md:text-2xl py-2 md:px-3 select-none">
                    <span className="hidden md:inline">→</span>
                    <span className="md:hidden">↓</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── WHY LUMINARY ── */}
      <AnimatedSection id="why" className="py-24 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Why Luminary?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {whyCards.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <GlassCard {...c} />
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── FINAL CTA ── */}
      <AnimatedSection id="cta" className="py-24 md:py-36 px-4 relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full animate-breathe"
            style={{
              background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, rgba(236,72,153,0.15) 40%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Your story deserves to be told.
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Start for free. Write your first entry today. No credit card, no pressure — just you and your thoughts.
          </p>
          <a
            href={AUTH_URL}
            className="inline-block text-lg font-semibold bg-primary text-primary-foreground px-10 py-4 rounded-xl glow-button"
          >
            Start Writing for Free →
          </a>
          <p className="text-sm text-muted-foreground mt-6">Free forever · Available on Android</p>
        </div>
      </AnimatedSection>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <img src={logoFull} alt="Luminary" className="h-8" />
            <p className="text-sm text-muted-foreground">Your life, beautifully remembered.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Luminary. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LuminaryLanding;
