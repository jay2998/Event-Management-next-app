import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata = {
  title: "EventPro - Wedding & Event Management",
  description: "Pakistan-wide wedding planning, catering, decor & logistics management platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable}`}>
      <body className="bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}


