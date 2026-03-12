import { MapPin, MessageCircle, Phone } from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const contacts = [
  {
    icon: Phone,
    label: "Phone",
    value: "9440790818",
    href: "tel:+919440790818",
    external: false,
    ocid: "contact.phone.link",
  },
  {
    icon: MapPin,
    label: "Address",
    value:
      "48-14-61, Beside Ramachandra Brothers, Near Ramatalkies, Visakhapatnam 530016",
    href: null,
    external: false,
    ocid: "contact.address.card",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us on WhatsApp",
    href: "https://wa.me/919440790818",
    external: true,
    ocid: "contact.whatsapp.link",
  },
];

export function ContactUs() {
  return (
    <section
      id="contact-us"
      data-ocid="contact.section"
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-body font-700 text-primary uppercase tracking-widest mb-3">
            Get in Touch
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-800 tracking-tight">
            Contact <span className="text-primary">Us</span>
          </h2>
          <p className="mt-3 text-muted-foreground font-body max-w-md mx-auto">
            Reach out via phone, WhatsApp, or visit us directly — we&apos;re
            happy to help you get back on the court.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {contacts.map((c) => {
            const Icon = c.icon;
            const inner = (
              <>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-body font-700 text-muted-foreground uppercase tracking-widest mb-2">
                  {c.label}
                </p>
                <p className="font-body text-sm text-foreground leading-relaxed">
                  {c.value}
                </p>
              </>
            );

            return (
              <motion.div
                key={c.label}
                variants={cardVariants}
                data-ocid={c.ocid}
                className="group relative rounded-2xl border border-border bg-white p-7 flex flex-col items-center text-center hover:border-primary/50 transition-colors shadow-sm"
              >
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="flex flex-col items-center w-full h-full"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
