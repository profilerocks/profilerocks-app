import { Inter, JetBrains_Mono } from "next/font/google";

export const fontText = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"]
});

export const fontCode = JetBrains_Mono({
  weight: ["400"],
  subsets: ["latin"]
});
