import { Cormorant_Garamond, Inter } from "next/font/google";

/** UI — Inter only */
export const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500"],
});

/** Display — Cormorant Garamond (Canela substitute) */
export const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const fontClassNames = `${fontBody.variable} ${fontDisplay.variable}`;
