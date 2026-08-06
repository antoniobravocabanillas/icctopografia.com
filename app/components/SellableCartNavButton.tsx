"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "./SellableCartStore";

export default function SellableCartNavButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readCart().reduce((sum, item) => sum + item.quantity, 0));
    sync();
    window.addEventListener("terraqo-store-cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("terraqo-store-cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <Link className="cart-nav-link" href="/checkout/" aria-label={`Carrito técnico con ${count} productos`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
        <path d="M6 7h14l-1.6 8.2a2 2 0 0 1-2 1.6H9.1a2 2 0 0 1-2-1.7L5.7 4H3" />
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="17" cy="20" r="1.4" />
      </svg>
      <span>{count}</span>
    </Link>
  );
}
