import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDF raporu Türkçe karakterler için gömülü Roboto fontunu diskten okur;
  // bu dosyaların sunucu paketine (serverless trace) dâhil edilmesi şart.
  outputFileTracingIncludes: {
    "/api/rapor/[studentId]": ["src/assets/fonts/**/*"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
