import { Button } from "@/components/ui/button";
import { Lock, Menu, Share2, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Contact", href: "#contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleShare = async () => {
    const shareData = {
      title: "RacketFix – Badminton Racket Repair",
      text: "Get your badminton racket repaired by experts in Visakhapatnam!",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-deep"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            type="button"
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap
                className="w-5 h-5 text-primary-foreground"
                fill="currentColor"
              />
            </div>
            <span className="font-display font-800 text-xl tracking-tight">
              Racket<span className="text-primary">Fix</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                data-ocid={`nav.${link.label.toLowerCase().replace(/ /g, "-")}.link`}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-body font-500 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="font-body font-500 gap-1.5 text-muted-foreground hover:text-foreground text-xs"
              data-ocid="nav.admin_button"
              onClick={() => {
                window.location.href = "/admin";
              }}
            >
              <Lock className="w-3.5 h-3.5" />
              Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="font-body font-600 gap-2"
              data-ocid="nav.secondary_button"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              {shared ? "Copied!" : "Share"}
            </Button>
            <Button
              size="sm"
              className="bg-primary text-primary-foreground font-display font-700 hover:bg-primary/90 glow-lime"
              data-ocid="nav.primary_button"
              onClick={() => handleNavClick("#contact")}
            >
              Book Repair
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-foreground hover:bg-secondary"
            data-ocid="nav.toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="container px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left px-3 py-3 text-sm font-body text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Button
                variant="ghost"
                className="mt-2 font-body font-500 gap-2 text-muted-foreground justify-start"
                data-ocid="nav.admin_button"
                onClick={() => {
                  window.location.href = "/admin";
                }}
              >
                <Lock className="w-4 h-4" />
                Admin Login
              </Button>
              <Button
                variant="outline"
                className="font-body font-600 gap-2"
                data-ocid="nav.share_button"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                {shared ? "Copied!" : "Share"}
              </Button>
              <Button
                className="mt-1 bg-primary text-primary-foreground font-display font-700"
                onClick={() => handleNavClick("#contact")}
              >
                Book Repair
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
