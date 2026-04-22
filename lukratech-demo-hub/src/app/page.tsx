import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <header>
        <h1>LukraTech Demo Hub</h1>
        <p>
          Plataforma de demos de IA adaptable por sector para pymes en Colombia.
        </p>
      </header>
      <section>
        <h2>Demos disponibles</h2>
        <ul>
          <li>
            <Link href="/demos/ops-agent">Autonomous Ops Agent</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
