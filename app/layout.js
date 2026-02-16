import "./globals.css";

export const metadata = {
  title: "Smart Bookmark Web App",
  description: "A fast, secure bookmark manager with live sync.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
