import { Button } from "@/components/ui/button";
import { ArrowDown, CheckCircle, Zap } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  const scrollToForm = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a56db 0%, #1e3a8a 60%, #1e2d6b 100%)",
      }}
    >
      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* White glow blob top right */}
      <div
        className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* White glow blob bottom left */}
      <div
        className="absolute bottom-10 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Diagonal accent stripe - orange */}
      <div
        className="absolute top-0 right-0 w-1 h-full z-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #f97316 40%, #fb923c 60%, transparent 100%)",
          opacity: 0.6,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              <Zap className="w-3.5 h-3.5" style={{ color: "#ffffff" }} />
              <span
                className="text-xs font-body tracking-widest uppercase font-semibold"
                style={{ color: "#ffffff" }}
              >
                Professional Repair Service
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-800 leading-none tracking-tighter mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <span style={{ color: "#ffffff" }}>Expert </span>
            <span className="text-gradient-hero">Badminton</span>
            <br />
            <span style={{ color: "#ffffff" }}>Racket Repair</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl font-body font-400 leading-relaxed mb-8 max-w-xl"
            style={{ color: "rgba(255,255,255,0.8)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            From broken strings to cracked frames — we restore your racket to
            peak performance. Fast turnaround, precision craftsmanship.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              size="lg"
              className="font-display font-700 text-base px-8 py-6 transition-all hover:scale-105"
              style={{
                background: "#f97316",
                color: "#ffffff",
                boxShadow:
                  "0 4px 20px rgba(249,115,22,0.5), 0 2px 8px rgba(0,0,0,0.2)",
                border: "none",
                fontWeight: 700,
              }}
              data-ocid="hero.primary_button"
              onClick={scrollToForm}
            >
              Book a Repair
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="font-display font-600 text-base px-8 py-6 transition-all hover:scale-105"
              style={{
                borderColor: "rgba(255,255,255,0.5)",
                color: "#ffffff",
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
              data-ocid="hero.secondary_button"
              onClick={() =>
                document
                  .querySelector("#services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Services
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {["Same-day assessment", "All major brands"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#fbbf24" }}
                />
                <span
                  className="text-sm font-body"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <ArrowDown
          className="w-6 h-6"
          style={{ color: "rgba(255,255,255,0.6)" }}
        />
      </motion.div>
    </section>
  );
}
