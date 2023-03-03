import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1 className="text-4xl font-bold">Hello World</h1>
      <Link href="/about">go to about</Link>
    </main>
  );
}
