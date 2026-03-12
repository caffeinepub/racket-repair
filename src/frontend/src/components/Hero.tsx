import { Button } from "@/components/ui/button";
import { ArrowDown, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  const scrollToForm = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-noise">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/racket-repair-hero.dim_1200x700.jpg"
          alt="Badminton racket repair workshop"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.95 0.005 80) 1px, transparent 1px), linear-gradient(90deg, oklch(0.95 0.005 80) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Accent blob */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl z-0 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-body font-600 tracking-widest uppercase">
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
            Expert <span className="text-gradient-lime">Badminton</span>
            <br />
            Racket Repair
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground font-body font-400 leading-relaxed mb-8 max-w-xl"
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
              className="bg-primary text-primary-foreground font-display font-700 text-base px-8 py-6 glow-lime hover:bg-primary/90 transition-all"
              data-ocid="hero.primary_button"
              onClick={scrollToForm}
            >
              Book a Repair
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground font-display font-600 text-base px-8 py-6 hover:bg-secondary"
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
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-body text-muted-foreground">
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
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
}
