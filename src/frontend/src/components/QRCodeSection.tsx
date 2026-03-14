import { QrCode } from "lucide-react";
import { motion } from "motion/react";

export function QRCodeSection() {
  const websiteUrl = window.location.origin;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(websiteUrl)}&bgcolor=ffffff&color=1a56db&margin=10`;

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: "#f0f4ff" }}
      data-ocid="qrcode.section"
    >
      <div className="container mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <QrCode className="w-6 h-6" style={{ color: "#1a56db" }} />
            <h2 className="text-2xl font-bold" style={{ color: "#1e3a8a" }}>
              Scan to Visit Our Website
            </h2>
          </div>
          <p className="text-gray-500 mb-8 text-sm">
            Share this QR code with friends or print it for your shop — scan
            with any phone camera to open the site instantly.
          </p>

          <div
            className="inline-block rounded-2xl p-5 shadow-lg"
            style={{ backgroundColor: "#ffffff", border: "2px solid #1a56db" }}
          >
            <img
              src={qrUrl}
              alt="QR Code for RacketFix website"
              width={200}
              height={200}
              className="rounded-lg"
              data-ocid="qrcode.canvas_target"
            />
          </div>

          <p className="mt-4 text-xs text-gray-400 break-all">{websiteUrl}</p>
        </motion.div>
      </div>
    </section>
  );
}
