"use client";

import { useState } from "react";

/**
 * Galería de fotos del producto. Si hay fotos, muestra la principal grande y
 * miniaturas clicables. Si no hay, cae al placeholder con emoji y color.
 */
export default function Galeria({
  imgs,
  emoji,
  bg,
}: {
  imgs: string[];
  emoji: string;
  bg: string;
}) {
  const [sel, setSel] = useState(0);

  if (!imgs.length) {
    return (
      <div className="gallery">
        <div className="main" style={{ background: bg }}>
          {emoji}
        </div>
        <div className="thumbs">
          {[emoji, "📷", "📷", "📷", "📷"].map((t, i) => (
            <div className="thumb" style={{ background: bg }} key={i}>
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <div
        className="main"
        style={{ background: `#000 center/cover no-repeat url(${imgs[sel]})` }}
      />
      <div className="thumbs">
        {imgs.map((src, i) => (
          <button
            key={i}
            type="button"
            className="thumb"
            onClick={() => setSel(i)}
            aria-label={`Ver foto ${i + 1}`}
            style={{
              padding: 0,
              cursor: "pointer",
              background: `#000 center/cover no-repeat url(${src})`,
              outline: i === sel ? "3px solid var(--verde-700)" : "none",
              outlineOffset: -1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
