import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kisan Mitra: Magical AI for Indian Farmers",
    template: "%s | Kisan Mitra",
  },
  description:
    "Kisan Mitra is a magical, multilingual AI assistant for Indian farmers. Get market prices, government schemes, crop disease diagnosis, and more in your language!",
  keywords: [
    "Kisan Mitra",
    "Indian farmers",
    "AI assistant",
    "market prices",
    "government schemes",
    "crop disease diagnosis",
    "magical",
    "multilingual",
    "agriculture",
    "farming",
    "India",
  ],
  openGraph: {
    title: "Kisan Mitra: Magical AI for Indian Farmers",
    description:
      "A magical, multilingual AI assistant for Indian farmers. Get market prices, government schemes, crop disease diagnosis, and more!",
    url: "https://yourdomain.com/",
    siteName: "Kisan Mitra",
    images: [
      {
        url: "/globe.svg",
        width: 1200,
        height: 630,
        alt: "Kisan Mitra Magical AI",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kisan Mitra: Magical AI for Indian Farmers",
    description:
      "A magical, multilingual AI assistant for Indian farmers. Get market prices, government schemes, crop disease diagnosis, and more!",
    images: ["/globe.svg"],
    creator: "@kisanmitraai",
  },
  icons: {
    icon: "/favicon.ico",
  },
  authors: [{ name: "Kisan Mitra Team" }],
  metadataBase: new URL("https://yourdomain.com/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const CLERK_ENABLED =
    process.env.DISABLE_CLERK !== "true" &&
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("local_dummy");

  return (
    <html lang="en">
      <body>
        {/* Expose a client flag so client components can detect Clerk availability */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: `window.__CLERK_ENABLED=${CLERK_ENABLED}` }}
        />
        {CLERK_ENABLED ? <ClerkProvider>{children}</ClerkProvider> : <>{children}</>}
      </body>
    </html>
  );
}
