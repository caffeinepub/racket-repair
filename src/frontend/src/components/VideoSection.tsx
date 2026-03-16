const videos = [
  { url: "https://www.facebook.com/share/r/1C1WdhQWFe/", id: "video1" },
  { url: "https://www.facebook.com/share/r/1bxi5aGRTN/", id: "video2" },
];

export function VideoSection() {
  return (
    <section
      id="video"
      style={{ backgroundColor: "#f8f9fa" }}
      className="py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl font-bold text-center mb-2"
          style={{ color: "#1a3a6b" }}
        >
          Watch Us Work
        </h2>
        <p className="text-center text-gray-500 mb-8">
          See how we repair your badminton rackets professionally
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video, i) => (
            <div
              key={video.id}
              className="rounded-xl overflow-hidden shadow-md border border-gray-200"
              data-ocid={`video.section.${i + 1}`}
            >
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                }}
              >
                <iframe
                  src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.url)}&show_text=false&width=560&appId`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title={`Racket Repair Video ${i + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
