import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";
import { motion } from "motion/react";

const plans = [
  {
    name: "Grip Replacement",
    price: "$10",
    description: "Quick swap, maximum comfort",
    features: [
      "Synthetic or leather grip",
      "Any handle size",
      "Same-day service",
    ],
    featured: false,
  },
  {
    name: "Basic Restring",
    price: "$15",
    description: "Economy string, great playability",
    features: [
      "Entry-level synthetic gut",
      "Tension up to 26 lbs",
      "24-hr turnaround",
    ],
    featured: false,
  },
  {
    name: "Premium Restring",
    price: "$25",
    description: "Performance string for serious players",
    features: [
      "Premium Yonex or BG string",
      "Custom tension (18–30 lbs)",
      "Grommet check included",
    ],
    featured: true,
  },
  {
    name: "Full Service",
    price: "$45",
    description: "Complete racket restoration",
    features: [
      "Premium restring",
      "Grip replacement",
      "Frame inspection",
      "Deep clean",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs font-body font-700 tracking-widest uppercase mb-3">
            Transparent Pricing
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-tighter leading-none">
            Simple,
            <br />
            <span className="text-gradient-lime">Honest Rates</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
            >
              <Card
                className={`h-full relative overflow-hidden card-hover ${
                  plan.featured
                    ? "border-primary/60 bg-primary/5"
                    : "bg-card border-border"
                }`}
                data-ocid={`pricing.item.${i + 1}`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                )}
                {plan.featured && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-body font-700 px-2 py-0.5 rounded-full">
                    Popular
                  </div>
                )}
                <CardHeader className="pb-4 pt-6 px-6">
                  <p className="text-muted-foreground text-xs font-body font-600 uppercase tracking-widest mb-1">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display text-4xl font-800">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm font-body">
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-body text-muted-foreground">
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full font-display font-700 ${
                      plan.featured
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-lime"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                    data-ocid={`pricing.primary_button.${i + 1}`}
                    onClick={() =>
                      document
                        .querySelector("#contact")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
