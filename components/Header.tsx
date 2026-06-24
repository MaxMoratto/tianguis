import Link from "next/link";
import MarketStatusPill from "./MarketStatusPill";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link className="logo" href="/">
          <span className="mark">🛖</span>
          <span>
            Tianguis<span className="mx">·MX</span>
          </span>
        </Link>
        <nav className="nav-links">
          <Link href="/mercado">Mercado</Link>
          <Link href="/#planes">Planes</Link>
          <Link href="/#como">Cómo funciona</Link>
          <Link href="/panel/vendedor">Vender</Link>
        </nav>
        <div className="nav-right">
          <MarketStatusPill />
          <AuthButton />
          <Link className="btn btn-primary btn-sm" href="/panel/vendedor">
            Abrir mi puesto
          </Link>
        </div>
      </div>
    </header>
  );
}
