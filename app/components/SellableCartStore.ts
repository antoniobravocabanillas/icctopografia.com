"use client";

import { CART_STORAGE_KEY, CartItem } from "../lib/sellable-store";

export function normalizeCartItem(item: CartItem): CartItem {
  return {
    ...item,
    quantity: Math.max(1, Math.min(Number(item.quantity || 1), Math.max(Number(item.stock || 1), 1))),
  };
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.map((item) => normalizeCartItem(item as CartItem)).filter((item) => item.productId) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.map(normalizeCartItem)));
  window.dispatchEvent(new Event("terraqo-store-cart-updated"));
}

export function addCartItem(item: CartItem) {
  const current = readCart();
  const existing = current.find((entry) => entry.productId === item.productId);
  const next = existing
    ? current.map((entry) => (entry.productId === item.productId ? normalizeCartItem({ ...entry, quantity: entry.quantity + item.quantity }) : entry))
    : [...current, normalizeCartItem(item)];
  writeCart(next);
  return next;
}
