import Link from "next/link";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="logo" href="/">
              <span className="mark">🛖</span>
              <span>
                Tianguis<span className="mx">·MX</span>
              </span>
            </Link>
            <p
              style={{
                marginTop: 14,
                maxWidth: 300,
                fontSize: 14,
                color: "#9aa5a0",
              }}
            >
              El mercado en línea que abre por horas. Productos únicos,
              vendedores locales, la energía del tianguis de siempre.
            </p>
            <p style={{ marginTop: 14, fontSize: 13, color: "#7e8884" }}>
              Miércoles y Sábado · 6:30 AM – 2:00 PM
            </p>
          </div>
          <div>
            <h4>Comprar</h4>
            <Link href="/mercado">Explorar mercado</Link>
            <Link href="/mercado">Categorías</Link>
            <Link href="/panel/comprador">Mi cuenta</Link>
            <Link href="/#faq">Preguntas</Link>
          </div>
          <div>
            <h4>Vender</h4>
            <Link href="/panel/vendedor">Abrir puesto</Link>
            <Link href="/#planes">Planes y precios</Link>
            <Link href="/panel/vendedor">Panel vendedor</Link>
            <Link href="/panel/admin">Centro de control</Link>
          </div>
          <div>
            <h4>Empresa</h4>
            <Link href="/">Nosotros</Link>
            <Link href="/">Centros de entrega</Link>
            <Link href="/">Seguridad</Link>
            <Link href="/">Contacto</Link>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Tianguis Digital MX · Hecho en México 🇲🇽</span>
          <span>MVP · Next.js + TypeScript</span>
        </div>
      </div>
    </footer>
  );
}
