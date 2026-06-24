import Link from "next/link";
import ProductoForm from "@/components/ProductoForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar producto — Tianguis Digital MX" };

export default function EditarProductoPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="page">
      <div className="wrap" style={{ maxWidth: 560 }}>
        <div className="crumbs">
          <Link href="/">Inicio</Link> /{" "}
          <Link href="/panel/vendedor">Panel del vendedor</Link> / Editar producto
        </div>
        <h2 className="sec-title" style={{ margin: "8px 0 0" }}>
          Editar producto
        </h2>
        <ProductoForm productoId={Number(params.id)} />
      </div>
    </div>
  );
}
