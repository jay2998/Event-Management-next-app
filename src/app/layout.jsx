import "./globals.css";
import "./theme.css";
import { Playfair_Display, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata = {
  title: "EventPro - Wedding & Event Management",
  description: "Pakistan-wide wedding planning, catering, decor & logistics management platform.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className="bg-background text-foreground font-sans">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-xl focus:border-2 focus:border-[#d4af37] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-[#3d2c1f] focus:shadow-lg focus:outline-none">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
