import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ITFIT Dashboard",
  description: "Jednoduchý ITFIT MVP dashboard"
};

const navItems = [
  { href: "/", label: "Dnes" },
  { href: "/workouts", label: "Tréninky" },
  { href: "/log", label: "Historie" },
  { href: "/settings", label: "Nastavení" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="min-h-screen">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-24 pt-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">ITFIT</h1>
            <p className="text-sm text-slate-500">Jednoduchý dashboard</p>
          </header>
          <main className="flex-1">{children}</main>
          <nav className="fixed bottom-4 left-1/2 w-full max-w-md -translate-x-1/2 px-4">
            <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-2 shadow-lg">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-2 py-2 text-center text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
