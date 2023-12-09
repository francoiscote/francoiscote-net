import { Manrope } from "next/font/google";
import "@/styles/globals.css";

import { NavBar } from "@components/NavBar";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata = {
  title: "francoiscote.net",
  description:
    "Bonjour, My name is François Côté, and I am a Web Developer based in Montréal (QC), Canada.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <main className="max-w-screen-xl my-0 mx-auto px-4">
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  );
}
