"use client";

import { NextPageContext } from "next";

export default function AboutId({ params }: NextPageContext) {
  return (
    <main>
      <h1 className="text-4xl font-bold">About id</h1>
      <h2 className="text-2xl font-bold">aa {params.id}</h2>
    </main>
  );
}
