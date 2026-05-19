import "./globals.css";
import "./theme.css";

export const metadata = {
  title: "EventPro - Wedding & Event Management",
  description: "Pakistan-wide wedding planning, catering, decor & logistics management platform.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}


