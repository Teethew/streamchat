import Link from "next/link";
import { use } from "react";

export default async function About() {
  const todos = (await fetch("https://jsonplaceholder.typicode.com/todos").then(
    (it) => it.json()
  )) as { id: number; title: string }[];
  return (
    <main>
      <h1 className="text-4xl font-bold">About</h1>
      {todos.map((todo) => (
        <Link key={todo.id} href={`/about/${todo.id}`}>
          {todo.title}
        </Link>
      ))}
    </main>
  );
}
