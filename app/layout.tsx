import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TJ Sokol Dolní Lhota",
  description: "Mini web fotbalového týmu s historií, soupiskou a galerií"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="min-h-screen bg-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-10 pt-6">
          <header className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
            <h1 className="text-2xl font-semibold">TJ Sokol Dolní Lhota</h1>
            <p className="text-sm text-slate-500">Historie, tým a klubové momenty na jednom místě</p>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
