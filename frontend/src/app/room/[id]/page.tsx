"use client";

export default function Room({ params: { id } }: { params: { id: string } }) {
  return (
    <main className="container mx-auto flex-grow flex flex-col p-8">{id}</main>
  );
}
