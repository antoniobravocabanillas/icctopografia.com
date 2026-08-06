"use client";

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

  return (
    <button className="store-action-button primary" type="button" onClick={add}>
      {added ? "Ver / continuar pedido" : quoteOnly ? "Agregar para cotizar" : label}
    </button>
  );
}
