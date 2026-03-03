import "./globals.css";
import { UnifrakturMaguntia, Playfair_Display, EB_Garamond, Space_Mono, Inter } from "next/font/google";

const unifraktur = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-unifraktur",
});

const display = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});

const body = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${unifraktur.variable} ${display.variable} ${body.variable} ${mono.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
