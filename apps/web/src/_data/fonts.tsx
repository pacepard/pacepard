import localFont from "next/font/local";

export const useFont = localFont({
  src: [
    {
      path: "../styles/fonts/Sora-latin-ext.woff2",
      style: "normal",
    },
    {
      path: "../styles/fonts/Sora-latin.woff2",
      style: "normal",
    },
  ],
  variable: "--font-plus-jakarta",
  display: "swap",
});
