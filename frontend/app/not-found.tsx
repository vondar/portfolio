import Link from "next/link";


export default function NotFound() {
  return (
    <section className="empty-state">
      <p className="eyebrow">404 · Signal lost</p>
      <h1>That project does not exist.</h1>
      <Link className="button-link" href="/">Return to the portfolio</Link>
    </section>
  );
}

