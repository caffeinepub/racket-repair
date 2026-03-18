import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useSubmitRepair } from "@/hooks/useQueries";
import {
  CheckCircle2,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SERVICES = [
  {
    name: "Restringing",
    icon: "🏸",
    desc: "Professional string replacement for all racket types",
  },
  {
    name: "Frame Repair",
    icon: "🔧",
    desc: "Crack and breakage repair to restore full strength",
  },
  {
    name: "Grip Replacement",
    icon: "✋",
    desc: "Fresh grip tape for better control and comfort",
  },
  {
    name: "Grommet Replacement",
    icon: "⚙️",
    desc: "Replace worn grommets to protect your strings",
  },
  {
    name: "Cricket Bat Repair",
    icon: "🏏",
    desc: "Bat crack filling, toe guard, and full restoration",
  },
  {
    name: "Full Restoration",
    icon: "✨",
    desc: "Complete overhaul — frame, string, grip and more",
  },
];

const SERVICE_TYPES = [
  "Restringing",
  "Frame Repair",
  "Grip Replacement",
  "Grommet Replacement",
  "Full Restoration",
  "Other",
  "Cricket Bat Repair",
  "Cricket Bat Handle",
  "Cricket Bat Binding",
];

const STRING_TYPES = [
  "Yonex BG 65",
  "Yonex BG Ti",
  "Yonex BG Power 80",
  "Yonex Ulimax 66",
  "Lining N0 7",
  "Konex",
  "Vextor VBS 70",
];

const PAYMENT_MODES = ["Phone Pay", "Card", "Cash"];

const PRODUCTS = [
  {
    img: "/assets/uploads/41NFSXtiUSL._AC_UF350-350_QL80_-1.jpg",
    name: "Badminton Grip Tape",
    desc: "High-quality grip tape for perfect handling",
  },
  {
    img: "/assets/uploads/300016219-2.jpg",
    name: "Stringing Awl Tool",
    desc: "Professional stringing tool for precise work",
  },
  {
    img: "/assets/uploads/yonex-badminton-grommet-strips__69743__77706.1698770344-3.jpg",
    name: "Yonex Grommet Strips",
    desc: "Original Yonex replacement grommet strips",
  },
];

// Simple QR code generator using Google Charts API (no external package needed)
function QRCode({ url }: { url: string }) {
  const encoded = encodeURIComponent(url);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}&bgcolor=ffffff&color=1a3c8c&margin=10`;
  return (
    <div className="inline-block bg-white border-2 border-primary rounded-xl p-5 shadow-card">
      <img
        src={src}
        alt="QR Code"
        width={180}
        height={180}
        className="rounded"
      />
    </div>
  );
}

export default function HomePage() {
  const { actor, isFetching } = useActor();
  const submitMutation = useSubmitRepair();
  const formRef = useRef<HTMLDivElement>(null);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    racketBrand: "",
    numberOfRackets: 1,
    serviceType: "",
    stringType: "",
    paymentMode: "",
    damageDescription: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState("");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "RacketFix",
          text: "Expert badminton & cricket bat repairs in Visakhapatnam",
          url: pageUrl,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(pageUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Backend is connecting, please wait...");
      return;
    }
    try {
      await submitMutation.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        racketBrand: form.racketBrand,
        damageDescription: form.damageDescription,
        serviceType: form.serviceType,
        stringType: form.stringType,
        paymentMode: form.paymentMode,
        numberOfRackets: BigInt(form.numberOfRackets),
      });
      setSubmittedPhone(form.phone);
      setSubmitted(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        racketBrand: "",
        numberOfRackets: 1,
        serviceType: "",
        stringType: "",
        paymentMode: "",
        damageDescription: "",
      });
    } catch {
      toast.error("Failed to submit repair request. Please try again.");
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏸</span>
            <span className="font-display font-bold text-xl text-primary">
              RacketFix
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:9440790818"
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">9440790818</span>
            </a>
            <a href="/admin">
              <Button
                size="sm"
                className="bg-blue-800 text-white hover:bg-blue-900 font-semibold flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                Admin Login
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-5xl mb-4">🏸</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-3">
              RacketFix
            </h1>
            <p className="text-lg md:text-2xl opacity-90 mb-6 font-light">
              Expert Badminton &amp; Cricket Bat Repairs
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm opacity-85 mb-8">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                48-14-61 Beside Ramachandra Brothers, Near Ramatalkies,
                Visakhapatnam 530016
              </span>
            </div>
            <a
              href="tel:9440790818"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold text-lg px-6 py-3 rounded-full shadow-hero hover:shadow-card-hover transition-shadow mb-6"
            >
              <Phone className="w-5 h-5" />
              9440790818
            </a>
            <div className="mt-4">
              <Button
                onClick={scrollToForm}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary font-semibold"
              >
                Book a Repair
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Our Services
            </h2>
            <p className="text-muted-foreground">
              Professional repair services for all racket sports
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white border border-border rounded-lg p-5 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                  {s.name}
                </h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Before &amp; After Repair
            </h2>
            <p className="text-muted-foreground">
              See the quality of our restoration work
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-card border border-border bg-white">
              <img
                src="/assets/uploads/broken-badminton-rackets-lying-on-600nw-2529309237-1.jpg"
                alt="Before repair"
                className="w-full h-56 object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-destructive text-destructive-foreground font-bold text-sm px-3 py-1">
                  BEFORE
                </Badge>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-card border border-border bg-white">
              <img
                src="/assets/uploads/Screenshot_20251016_132003-2.jpg"
                alt="After repair"
                className="w-full h-56 object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-success text-success-foreground font-bold text-sm px-3 py-1">
                  AFTER
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Products
            </h2>
            <p className="text-muted-foreground">
              Quality accessories and spare parts available at our shop
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                className="bg-white border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-contain p-3"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Repair Form */}
      <section ref={formRef} className="py-16 bg-muted" id="book-repair">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Book a Repair
            </h2>
            <p className="text-muted-foreground">
              Fill in your details and we&apos;ll get your racket fixed
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-border rounded-xl p-8 text-center shadow-card"
              data-ocid="repair_form.success_state"
              style={{ backgroundColor: "#fff" }}
            >
              <CheckCircle2 className="w-14 h-14 text-success mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Request Submitted!
              </h3>
              <p className="text-muted-foreground mb-4">
                We&apos;ve received your repair request. We&apos;ll contact you
                soon on <strong>{submittedPhone}</strong>.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Book Another Repair
              </Button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-border shadow-card p-6 space-y-4"
              data-ocid="repair_form.panel"
              style={{ backgroundColor: "#fff" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Customer Name *</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Your full name"
                    style={{ backgroundColor: "#fff" }}
                    data-ocid="repair_form.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="10-digit mobile number"
                    style={{ backgroundColor: "#fff" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="email@example.com"
                    style={{ backgroundColor: "#fff" }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brand">Racket / Bat Brand *</Label>
                  <Input
                    id="brand"
                    required
                    value={form.racketBrand}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, racketBrand: e.target.value }))
                    }
                    placeholder="e.g. Yonex, SG"
                    style={{ backgroundColor: "#fff" }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="qty">Number of Rackets / Bats</Label>
                  <Input
                    id="qty"
                    type="number"
                    min={1}
                    value={form.numberOfRackets}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        numberOfRackets: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                    style={{ backgroundColor: "#fff" }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Service Type *</Label>
                  <Select
                    required
                    value={form.serviceType}
                    onValueChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        serviceType: v,
                        stringType: v !== "Restringing" ? "" : f.stringType,
                      }))
                    }
                  >
                    <SelectTrigger
                      style={{ backgroundColor: "#fff" }}
                      data-ocid="repair_form.select"
                    >
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {form.serviceType === "Restringing" && (
                <div className="space-y-1.5">
                  <Label>String Type</Label>
                  <Select
                    value={form.stringType}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, stringType: v }))
                    }
                  >
                    <SelectTrigger style={{ backgroundColor: "#fff" }}>
                      <SelectValue placeholder="Select string type" />
                    </SelectTrigger>
                    <SelectContent>
                      {STRING_TYPES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Payment Mode *</Label>
                <Select
                  required
                  value={form.paymentMode}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, paymentMode: v }))
                  }
                >
                  <SelectTrigger
                    style={{ backgroundColor: "#fff" }}
                    data-ocid="repair_form.select"
                  >
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_MODES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc">Damage Description *</Label>
                <Textarea
                  id="desc"
                  required
                  rows={3}
                  value={form.damageDescription}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      damageDescription: e.target.value,
                    }))
                  }
                  placeholder="Describe the damage or issue with your racket/bat..."
                  style={{ backgroundColor: "#fff" }}
                  data-ocid="repair_form.textarea"
                />
              </div>
              <Button
                type="submit"
                disabled={submitMutation.isPending || (!actor && isFetching)}
                className="w-full bg-blue-800 text-white hover:bg-blue-900 font-semibold"
                data-ocid="repair_form.submit_button"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : !actor && isFetching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wrench className="w-4 h-4 mr-2" /> Submit Repair Request
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* QR Code */}
      <section className="py-16 bg-white">
        <div className="max-w-md mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Scan to Visit
          </h2>
          <p className="text-muted-foreground mb-6">
            Display this QR code at your shop so customers can scan and book
            instantly
          </p>
          {pageUrl && <QRCode url={pageUrl} />}
          <p className="text-xs text-muted-foreground mt-4">
            Scan with any phone camera to open RacketFix website
          </p>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-16 bg-muted">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">
            Contact Us
          </h2>
          <div
            className="bg-white rounded-xl border border-border shadow-card p-6 space-y-4"
            style={{ backgroundColor: "#fff" }}
          >
            <a
              href="tel:9440790818"
              className="flex items-center justify-center gap-3 text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-5 h-5 text-primary" />
              9440790818
            </a>
            <div className="flex items-start justify-center gap-3 text-sm text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>
                48-14-61 Beside Ramachandra Brothers, Near Ramatalkies,
                Visakhapatnam 530016
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href="https://wa.me/919440790818"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="bg-blue-800 text-white hover:bg-blue-900 font-semibold"
                  data-ocid="contact.button"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Us
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={handleShare}
                data-ocid="contact.button"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share Website
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <div className="font-display font-bold text-xl mb-2">
            🏸 RacketFix
          </div>
          <p className="text-sm opacity-80 mb-1">
            Expert Badminton &amp; Cricket Bat Repairs — Visakhapatnam
          </p>
          <p className="text-xs opacity-60">
            &copy; {new Date().getFullYear()} RacketFix. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(pageUrl ? new URL(pageUrl).hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline opacity-80 hover:opacity-100"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
