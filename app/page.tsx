import Link from "next/link";
import Countdown from "@/components/Countdown";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts, getStalls, PLAN_COLOR } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = (await getProducts()).slice(0, 8);
  const cats = getCategories().slice(0, 6);
  const stalls = await getStalls();

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-in">
          <span className="eyebrow">🇲🇽 El mercado que abre por horas</span>
          <h1 className="hero-title">
            El <span className="hl">tianguis</span> de toda la vida,
            <br />
            ahora en tu pantalla
          </h1>
          <p className="hero-sub">
            Productos únicos, de segunda mano y hechos a mano. El mercado abre
            miércoles y sábados — cuando suena la campana, empieza la acción.
          </p>

          <Countdown />

          <form className="bigsearch" action="/mercado">
            <span className="ico">🔍</span>
            <input
              name="q"
              placeholder="Busca lentes, herramientas, alebrijes…"
            />
            <button className="btn btn-primary" type="submit">
              Buscar
            </button>
          </form>

          <div className="hero-cta">
            <Link className="btn btn-dark" href="/mercado">
              Explorar el mercado
            </Link>
            <Link className="btn btn-outline" href="/rentar">
              Abrir mi puesto desde $10
            </Link>
          </div>

          <div className="trust">
            <span>
              🛖 <b>1,240</b> puestos activos
            </span>
            <span>
              📦 <b>18,500</b> productos
            </span>
            <span>
              ⭐ <b>4.8</b> calificación promedio
            </span>
            <span>🔒 Vendedores verificados</span>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2 className="sec-title">Explora por categoría</h2>
              <div className="sec-sub">Once pasillos llenos de hallazgos</div>
            </div>
            <Link className="link-more" href="/mercado">
              Ver todo →
            </Link>
          </div>
          <div className="cats">
            {cats.map((c) => (
              <Link className="cat" href={`/mercado?cat=${c.id}`} key={c.id}>
                <div className="emo">{c.e}</div>
                <div className="nm">{c.n}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2 className="sec-title">Hallazgos destacados</h2>
              <div className="sec-sub">Lo más visto este día de mercado</div>
            </div>
            <Link className="link-more" href="/mercado">
              Ver más →
            </Link>
          </div>
          <div className="grid">
            {featured.map((p) => (
              <ProductCard p={p} key={p.id} />
            ))}
          </div>
        </div>
      </section>

      {/* PUESTOS DESTACADOS */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2 className="sec-title">Puestos destacados</h2>
              <div className="sec-sub">Vendedores con la mejor reputación</div>
            </div>
          </div>
          <div className="stalls">
            {stalls.map((s) => (
              <Link className="stall" href={`/puesto/${s.slug}`} key={s.slug}>
                <div className="cover" style={{ background: s.bg }}>
                  <span className="plan" style={{ color: PLAN_COLOR[s.plan] }}>
                    {s.plan}
                  </span>
                </div>
                <div className="b">
                  <div className="nm">{s.n}</div>
                  <div className="tag">{s.tag}</div>
                  <div className="st">
                    <span>
                      ★ <b>{s.rating}</b>
                    </span>
                    <span>
                      <b>{s.prod}</b> productos
                    </span>
                    <span>
                      <b>{s.ventas}</b> ventas
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section
        className="block"
        id="como"
        style={{
          background: "var(--gris-50)",
          borderTop: "1px solid var(--gris-100)",
          borderBottom: "1px solid var(--gris-100)",
        }}
      >
        <div className="wrap">
          <div className="center" style={{ marginBottom: 36 }}>
            <h2 className="sec-title">Cómo funciona</h2>
            <div className="sec-sub">
              Simple para todos, también para quien no es de la tecnología
            </div>
          </div>
          <div className="steps">
            <div className="step">
              <div className="n">1</div>
              <h3>Renta tu puesto</h3>
              <p>
                Elige un plan desde $10 a la semana y sube hasta 10 fotos por
                producto. Publicar toma minutos.
              </p>
            </div>
            <div className="step">
              <div className="n">2</div>
              <h3>El mercado abre</h3>
              <p>
                Miércoles y sábados de 6:30 a 14:00. Todos llegan al mismo
                tiempo: tráfico concentrado y sensación de evento.
              </p>
            </div>
            <div className="step">
              <div className="n">3</div>
              <h3>Vende sin comisión</h3>
              <p>
                Solo pagas por exhibir. Lo que vendes es tuyo: cero comisión por
                venta. Entrega en persona o en un centro seguro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section className="block" id="planes">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 36 }}>
            <h2 className="sec-title">Renta tu puesto digital</h2>
            <div className="sec-sub">
              Sin comisiones por venta. Solo pagas por exhibir.
            </div>
          </div>
          <div className="plans">
            <div className="plan-card">
              <div className="pn">Puesto Básico</div>
              <div className="pp">
                $10 <span>/ semana</span>
              </div>
              <ul>
                <li>Aparece en el mercado</li>
                <li>Hasta 20 productos</li>
                <li>10 fotos por producto</li>
                <li>Chat con compradores</li>
              </ul>
              <Link className="btn btn-outline btn-block" href="/rentar">
                Empezar
              </Link>
            </div>
            <div className="plan-card feat">
              <div className="pn">Puesto Destacado</div>
              <div className="pp">
                $30 <span>/ semana</span>
              </div>
              <ul>
                <li>Todo lo del Básico</li>
                <li>Aparece arriba en búsquedas</li>
                <li>Insignia &quot;Destacado&quot;</li>
                <li>Estadísticas avanzadas</li>
                <li>Video por producto</li>
              </ul>
              <Link className="btn btn-primary btn-block" href="/rentar">
                Elegir Destacado
              </Link>
            </div>
            <div className="plan-card">
              <div className="pn">Puesto Premium</div>
              <div className="pp">
                $100 <span>/ semana</span>
              </div>
              <ul>
                <li>Todo lo del Destacado</li>
                <li>Portada en la home</li>
                <li>Promoción en categorías</li>
                <li>Soporte prioritario</li>
                <li>Productos ilimitados</li>
              </ul>
              <Link className="btn btn-outline btn-block" href="/rentar">
                Elegir Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="block" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2 className="sec-title">Lo que dice la banda</h2>
            </div>
          </div>
          <div className="testis">
            <div className="testi">
              <div className="stars">★★★★★</div>
              <p>
                &quot;Vendí mis cosas en un solo sábado. La gente llega con ganas
                de comprar porque saben que el mercado cierra.&quot;
              </p>
              <div className="who">
                <div className="avatar" style={{ background: "#0a7d4f" }}>
                  L
                </div>
                <div>
                  <b>Lupita R.</b>
                  <div className="r">Vendedora · CDMX</div>
                </div>
              </div>
            </div>
            <div className="testi">
              <div className="stars">★★★★★</div>
              <p>
                &quot;Encontré un iPhone restaurado buenísimo y a buen precio. Me
                gusta que sea local y pueda recoger cerca.&quot;
              </p>
              <div className="who">
                <div className="avatar" style={{ background: "#e0654b" }}>
                  C
                </div>
                <div>
                  <b>Carlos M.</b>
                  <div className="r">Comprador · Puebla</div>
                </div>
              </div>
            </div>
            <div className="testi">
              <div className="stars">★★★★★</div>
              <p>
                &quot;Por $30 a la semana mi puesto aparece arriba. Sin
                comisiones, todo lo que vendo es mío.&quot;
              </p>
              <div className="who">
                <div className="avatar" style={{ background: "#3a5bb8" }}>
                  A
                </div>
                <div>
                  <b>Ana L.</b>
                  <div className="r">Vendedora · Guadalajara</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="block"
        id="faq"
        style={{
          background: "var(--gris-50)",
          borderTop: "1px solid var(--gris-100)",
        }}
      >
        <div className="wrap">
          <div className="center" style={{ marginBottom: 30 }}>
            <h2 className="sec-title">Preguntas frecuentes</h2>
          </div>
          <div className="faq">
            <details className="qa" open>
              <summary>¿Por qué el mercado solo abre ciertos días?</summary>
              <p>
                Igual que un tianguis real. Concentrar la actividad en miércoles
                y sábados crea urgencia, más tráfico al mismo tiempo y la
                sensación de evento. Fuera de horario puedes navegar y preparar
                tu puesto, pero las compras se habilitan solo en horario de
                mercado.
              </p>
            </details>
            <details className="qa">
              <summary>¿Cuánto cuesta vender?</summary>
              <p>
                Desde $10 MXN a la semana por el Puesto Básico. No cobramos
                comisión por venta: solo pagas por exhibir tus productos.
              </p>
            </details>
            <details className="qa">
              <summary>¿Cómo recibo mi dinero?</summary>
              <p>
                Los pagos se acuerdan entre comprador y vendedor (efectivo en
                entrega, transferencia/SPEI, OXXO Pay, Mercado Pago, etc.).
                Próximamente pagos protegidos dentro de la plataforma.
              </p>
            </details>
            <details className="qa">
              <summary>¿Es seguro?</summary>
              <p>
                Verificamos por correo, SMS e identificación oficial. Tenemos
                reputación pública, reportes, moderación con IA y centros de
                entrega seguros en papelerías y tiendas afiliadas.
              </p>
            </details>
            <details className="qa">
              <summary>¿Necesito saber de tecnología?</summary>
              <p>
                No. Está diseñado para ser sencillo, con letra grande y pasos
                claros, pensado también para personas mayores.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="block">
        <div className="wrap">
          <div className="cta-final">
            <h2>El próximo día de mercado te está esperando</h2>
            <p>Abre tu puesto desde $10 o explora los hallazgos de hoy.</p>
            <div className="hero-cta" style={{ marginTop: 24 }}>
              <Link className="btn btn-primary" href="/rentar">
                Abrir mi puesto
              </Link>
              <Link
                className="btn btn-outline"
                style={{ borderColor: "rgba(255,255,255,.4)", color: "#fff" }}
                href="/mercado"
              >
                Explorar el mercado
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
