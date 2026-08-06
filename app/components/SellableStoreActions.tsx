"use client";

import Link from "next/link";
import { useState } from "react";
import { SellableProduct, toCartItem } from "../lib/sellable-store";
import { addCartItem } from "./SellableCartStore";

export function AddToCartAction({ product, label = "Agregar al carrito" }: { product: SellableProduct; label?: string }) {
  const [added, setAdded] = useState(false);
  const quoteOnly = Boolean(product.requiresQuote || !product.price);

  function add() {
    addCartItem(toCartItem(product));
    setAdded(true);
  }

  if (added) {
    return (
      <Link className="store-action-button primary" href="/checkout/">
        Ver carrito
      </Link>
    );
  }

  return (
    <button className="store-action-button primary" type="button" onClick={add}>
      {quoteOnly ? "Solicitar cotización" : label}
    </button>
  );
}
