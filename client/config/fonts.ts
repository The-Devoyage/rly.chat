import { Inter as FontSans, Space_Mono as FontMono } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});
