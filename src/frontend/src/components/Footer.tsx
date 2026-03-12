import { MapPin, Phone, Zap } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer
      className="relative border-t border-border"
      style={{ background: "oklch(0.1 0.006 265)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <Zap
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                />
              </div>
              <span className="font-display font-800 text-xl tracking-tight">
                Racket<span className="text-primary">Fix</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-body leading-relaxed max-w-xs">
              Precision racket repair for every level of play. From casual
              rallies to competitive tournaments — we keep you on court.
            </p>
          </div>

          <div>
            <p className="text-xs font-body font-700 text-muted-foreground uppercase tracking-widest mb-4">
              Quick Links
            </p>
            <ul className="space-y-2">
              {[
                { label: "Services", href: "#services" },
                { label: "How It Works", href: "#how-it-works" },
                { label: "Book a Repair", href: "#contact" },
                { label: "Contact Us", href: "#contact-us" },
              ].map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    className="text-sm font-body text-muted-foreground hover:text-primary transition-colors"
                    data-ocid="footer.link"
                    onClick={() =>
                      document
                        .querySelector(link.href)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-body font-700 text-muted-foreground uppercase tracking-widest mb-4">
              Contact
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="tel:+919440790818"
                  className="text-sm font-body text-muted-foreground hover:text-primary transition-colors"
                  data-ocid="footer.link"
                >
                  9440790818
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm font-body text-muted-foreground">
                  48-14-61, Beside Ramachandra Brothers,
                  <br />
                  Near Ramatalkies,
                  <br />
                  Visakhapatnam 530016
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-body text-muted-foreground">
            &copy; {year} RacketFix. All rights reserved.
          </p>
          <p className="text-xs font-body text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
