import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Marcus Tan",
    role: "Club player, 8 years",
    quote:
      "Brought in my Yonex Astrox after snapping strings mid-match. They restrung it at 28 lbs with BG80 Power overnight — feel is incredible. Won't go anywhere else.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Badminton coach",
    quote:
      "I send all my students here. The frame repair service saved a racket I thought was done for. Fast, affordable, and they actually explain what they fixed. Top marks.",
    rating: 5,
  },
  {
    name: "Daniel Hewitt",
    role: "Recreational player",
    quote:
      "Grip was falling off my Victor racket. They replaced it with a leather grip in 20 minutes while I waited. Cost me $10. Feels like a brand new racket. Highly recommend.",
    rating: 5,
  },
];

const STAR_LABELS = ["one", "two", "three", "four", "five"];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs font-body font-700 tracking-widest uppercase mb-3">
            What Players Say
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-tighter leading-none">
            Trusted by
            <br />
            <span className="text-gradient-lime">Players</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
            >
              <Card
                className="bg-card border-border h-full card-hover"
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <CardContent className="p-7">
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={STAR_LABELS[j]}
                        className="w-4 h-4 text-primary"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <blockquote className="text-sm font-body leading-relaxed text-foreground/90 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-display font-700 text-sm">
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-display font-700">{t.name}</p>
                      <p className="text-xs font-body text-muted-foreground">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
