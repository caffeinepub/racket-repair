import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitRepairRequest } from "@/hooks/useQueries";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function RepairForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    racketBrand: "",
    damageDescription: "",
  });

  const { mutate, isPending, isSuccess, isError, reset } =
    useSubmitRepairRequest();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      racketBrand: "",
      damageDescription: "",
    });
    reset();
  };

  return (
    <section
      id="contact"
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: "#ffffff" }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-xs font-body font-700 tracking-widest uppercase mb-3">
              Get Started
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 tracking-tighter leading-none mb-6">
              Book Your
              <br />
              <span className="text-gradient-primary">Repair</span>
            </h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-8">
              Submit your repair request and we'll get back to you within 2
              hours with confirmation and next steps.
            </p>
            <div className="space-y-4">
              {[
                {
                  label: "Workshop Location",
                  value:
                    "48-14-61, Beside Ramachandra Brothers, Near Ramatalkies, Visakhapatnam 530016",
                },
                { label: "Phone", value: "9440790818" },
                { label: "Hours", value: "Mon–Sat, 9am–7pm" },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="w-1 rounded-full bg-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs font-body font-600 text-muted-foreground uppercase tracking-widest">
                      {item.label}
                    </p>
                    <p className="text-sm font-body text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {isSuccess ? (
              <div
                className="bg-card border border-primary/30 rounded-2xl p-10 text-center"
                data-ocid="form.success_state"
              >
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="font-display text-2xl font-700 mb-2">
                  Request Submitted!
                </h3>
                <p className="text-muted-foreground font-body mb-6">
                  We've received your repair request and will contact you within
                  2 hours.
                </p>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-border hover:bg-secondary font-display font-600"
                  data-ocid="form.secondary_button"
                >
                  Submit Another
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-100 rounded-2xl p-8 space-y-5 shadow-md"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-xs font-body font-600 text-muted-foreground uppercase tracking-widest"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="bg-white border-border focus:border-primary font-body"
                      data-ocid="form.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-body font-600 text-muted-foreground uppercase tracking-widest"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="bg-white border-border focus:border-primary font-body"
                      data-ocid="form.input"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-body font-600 text-muted-foreground uppercase tracking-widest"
                    >
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="bg-white border-border focus:border-primary font-body"
                      data-ocid="form.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="racketBrand"
                      className="text-xs font-body font-600 text-muted-foreground uppercase tracking-widest"
                    >
                      Racket Brand
                    </Label>
                    <Input
                      id="racketBrand"
                      name="racketBrand"
                      placeholder="Yonex, Victor, Li-Ning…"
                      value={form.racketBrand}
                      onChange={handleChange}
                      required
                      className="bg-white border-border focus:border-primary font-body"
                      data-ocid="form.input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="damageDescription"
                    className="text-xs font-body font-600 text-muted-foreground uppercase tracking-widest"
                  >
                    Describe the Damage
                  </Label>
                  <Textarea
                    id="damageDescription"
                    name="damageDescription"
                    placeholder="e.g. Broken strings on main court, hairline crack on frame near throat..."
                    value={form.damageDescription}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="bg-white border-border focus:border-primary font-body resize-none"
                    data-ocid="form.textarea"
                  />
                </div>
                {isError && (
                  <div
                    className="flex items-center gap-2 text-destructive text-sm font-body"
                    data-ocid="form.error_state"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Something went wrong. Please try again.</span>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full font-display font-700 text-base py-6 hover:opacity-90 transition-opacity"
                  style={{
                    background: "#f97316",
                    color: "#ffffff",
                    border: "none",
                  }}
                  data-ocid="form.submit_button"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Repair Request"
                  )}
                </Button>
                {isPending && (
                  <div className="text-center" data-ocid="form.loading_state">
                    <p className="text-xs text-muted-foreground font-body">
                      Processing your request…
                    </p>
                  </div>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
