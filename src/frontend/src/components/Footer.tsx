import { MapPin, Phone, Zap } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="relative" style={{ background: "#1e3a8a" }}>
      <style>{`
        .footer-link { color: rgba(255,255,255,0.7); }
        .footer-link:hover, .footer-link:focus { color: #ffffff; }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center"
                style={{ background: "#f97316" }}
              >
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span className="font-display font-800 text-xl tracking-tight text-white">
                Racket<span style={{ color: "#f97316" }}>Fix</span>
              </span>
            </div>
            <p
              className="text-sm font-body leading-relaxed max-w-xs"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Precision racket repair for every level of play. From casual
              rallies to competitive tournaments — we keep you on court.
            </p>
          </div>

          <div>
            <p
              className="text-xs font-body font-700 uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
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
                    className="footer-link text-sm font-body transition-colors"
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
            <p
              className="text-xs font-body font-700 uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Contact
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <Phone
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "#f97316" }}
                />
                <a
                  href="tel:+919440790818"
                  className="footer-link text-sm font-body transition-colors"
                  data-ocid="footer.link"
                >
                  9440790818
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: "#f97316" }}
                />
                <span
                  className="text-sm font-body"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
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

        <div
          className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <p
            className="text-xs font-body"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            &copy; {year} RacketFix. All rights reserved.
          </p>
          <p
            className="text-xs font-body"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#f97316" }}
              className="hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
