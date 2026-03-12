import { ClipboardList, PackageCheck, Trophy } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Submit a Request",
    description:
      "Fill out our repair request form with your racket brand and a description of the damage. We'll confirm your booking within 2 hours.",
  },
  {
    number: "02",
    icon: PackageCheck,
    title: "Drop Off Your Racket",
    description:
      "Bring your racket to our workshop. Our technician will do a full assessment and confirm the repair plan and cost before any work begins.",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Pick Up — Good as New",
    description:
      "Most repairs are completed within 24 hours. You'll receive an SMS notification when your racket is ready for collection.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: "#f0f4ff" }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs font-body font-700 tracking-widest uppercase mb-3">
            Simple Process
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-tighter leading-none">
            How It
            <br />
            <span className="text-gradient-primary">Works</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          <div
            className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-primary/30 to-primary/30"
            style={{ left: "16.67%", right: "16.67%" }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.15, ease: "easeOut" }}
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-20 h-20 rounded-2xl bg-white flex items-center justify-center border border-border flex-shrink-0 shadow-sm">
                    <step.icon className="w-8 h-8 text-primary" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-display font-800 flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <span className="font-display text-6xl font-800 text-muted-foreground/20 leading-none select-none">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display text-xl font-700 mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
