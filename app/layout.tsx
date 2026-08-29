import "./globals.css";

export const metadata = {
  title: "UPSC AI",
  description: "An open-source AI study companion for UPSC CSE aspirants",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
