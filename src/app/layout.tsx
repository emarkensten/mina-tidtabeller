import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Next +Component Library Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
