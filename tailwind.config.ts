import type { Config } from "tailwindcss";

// La paleta de marca también vive aquí para que esté disponible como utilidades
// de Tailwind (ej. text-verde, bg-terracota). El detalle de los componentes
// está en app/globals.css usando estas mismas variables CSS.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        verde: {
          DEFAULT: "#0a7d4f",
          700: "#06623b",
          900: "#0a3d27",
          50: "#e8f5ee",
        },
        terracota: "#e0654b",
        amarillo: "#f4b740",
        negro: "#101413",
        rojo: "#d23b3b",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        wrap: "1160px",
      },
    },
  },
  plugins: [],
};

export default config;
