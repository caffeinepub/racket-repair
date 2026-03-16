export function BeforeAfter() {
  return (
    <section
      id="before-after"
      style={{ backgroundColor: "#ffffff" }}
      className="py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl font-bold text-center mb-2"
          style={{ color: "#1a3a6b" }}
        >
          Before &amp; After Repair
        </h2>
        <p className="text-center text-gray-500 mb-10">
          See the difference a professional repair makes
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Before */}
          <div
            className="rounded-xl overflow-hidden shadow-md border border-gray-100"
            data-ocid="before_after.before.card"
          >
            <div className="relative">
              <img
                src="/assets/uploads/broken-badminton-rackets-lying-on-600nw-2529309237-1.jpg"
                alt="Broken badminton racket frame"
                className="w-full object-cover"
                style={{ maxHeight: 280 }}
              />
              <span
                className="absolute top-3 left-3 text-white text-sm font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: "#dc2626" }}
              >
                BEFORE
              </span>
            </div>
            <div className="p-4" style={{ backgroundColor: "#ffffff" }}>
              <h3
                className="font-semibold text-lg"
                style={{ color: "#1a3a6b" }}
              >
                Broken Frame
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Cracked frame, snapped strings, unplayable racket
              </p>
            </div>
          </div>

          {/* After */}
          <div
            className="rounded-xl overflow-hidden shadow-md border border-gray-100"
            data-ocid="before_after.after.card"
          >
            <div className="relative">
              <img
                src="/assets/uploads/Screenshot_20251016_132003-2.jpg"
                alt="Repaired badminton racket"
                className="w-full object-cover"
                style={{ maxHeight: 280 }}
              />
              <span
                className="absolute top-3 left-3 text-white text-sm font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: "#16a34a" }}
              >
                AFTER
              </span>
            </div>
            <div className="p-4" style={{ backgroundColor: "#ffffff" }}>
              <h3
                className="font-semibold text-lg"
                style={{ color: "#1a3a6b" }}
              >
                Repaired &amp; Ready
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Fresh strings, restored frame, ready to play again
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
