import { Card, CardContent } from "@/components/ui/card";
import { Hand, Layers, Sparkles, Wrench } from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: Layers,
    title: "Restringing",
    description:
      "Precision restringing using premium synthetic gut or natural gut strings. We match tension to your playing style — from 18 to 30 lbs.",
  },
  {
    icon: Hand,
    title: "Grip Replacement",
    description:
      "Worn grips cause mis-hits and hand fatigue. We fit overgrips or replacement grips in leather, toweling, or synthetic — your choice.",
  },
  {
    icon: Wrench,
    title: "Frame Repair",
    description:
      "Hairline cracks, bent frames, damaged grommets — our technicians assess and repair structural damage to extend racket life.",
  },
  {
    icon: Sparkles,
    title: "Full Restoration",
    description:
      "Complete overhaul: restring, new grip, frame inspection, grommet replacement, and a deep clean. Back to like-new condition.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs font-body font-700 tracking-widest uppercase mb-3">
            What We Do
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-tighter leading-none">
            Our Repair
            <br />
            <span className="text-gradient-primary">Services</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
            >
              <Card
                className="bg-white border-border h-full card-hover cursor-default border-t-2 border-t-primary"
                data-ocid={`services.item.${i + 1}`}
              >
                <CardContent className="p-6 pt-7">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 hover:bg-primary/20 transition-colors">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-700 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
