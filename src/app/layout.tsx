import type { Metadata } from "next";
import "./globals.css";
import Nav from "./Nav";
import Footer from "./Footer";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "TapLokal",
  description: "TapLokal is the process of ordering food, with just a tap. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased container mx-auto px-2 lg:px-10`}>
        <Suspense>
          <Toaster position="bottom-center" />
          <Nav />
          {children}
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
