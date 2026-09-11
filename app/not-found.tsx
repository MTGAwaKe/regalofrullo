import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found-icon">🎁</span>
      <h1 className="title">Frullino, torna indietro,</h1>
      <p className="lead">qui non ci devi stare!</p>
      <Link href="/" className="btn not-found-btn">
        Torna al biglietto
      </Link>
    </div>
  );
}
