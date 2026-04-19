import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Loto Fabrics | Premium Embroidered Fabrics UAE",
    template: "%s | Loto Fabrics",
  },
  description:
    "Premium embroidered fabrics from the UAE. Exquisite craftsmanship, handcrafted luxury fabrics sold by the meter. Shop silk, cotton, chiffon, and more.",
  keywords: [
    "fabrics",
    "embroidered fabrics",
    "UAE fabrics",
    "luxury fabrics",
    "silk",
    "cotton",
    "chiffon",
    "loto fabrics",
    "أقمشة",
    "أقمشة مطرزة",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
