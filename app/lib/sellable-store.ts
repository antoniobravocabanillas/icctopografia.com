export type SellableProduct = {
  id?: string;
  slug: string;
  name: string;
  title?: string;
  brand?: string;
  model?: string;
  category?: string;
  categorySlug?: string;
  summary?: string;
  description?: string;
  price?: number | null;
  currency?: string;
  requiresQuote?: boolean;
  availability?: string;
  badge?: string;
  stock?: number;
  commercialMode?: string;
  tags?: string[];
  images?: string[];
  mainImage?: string;
  specs?: Record<string, unknown>;
  specifications?: Record<string, unknown>;
  variants?: unknown[];
  terraqoWorkspaceId?: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  brand?: string;
  model?: string;
  price: number;
  currency: string;
  image?: string;
  stock: number;
  requiresQuote: boolean;
  quantity: number;
  workspaceId?: string;
};

export const CART_STORAGE_KEY = "terraqo-sellable-store:icc-topografia";

export function assetPath(path?: string) {
  return (path || "/images/equipo-topografico-store.jpg").replace(/^\.\/public\//, "/").replace(/^\.\/+/, "/");
}

export function formatPrice(price?: number | null, currency = "USD") {
  if (!price) return "Cotizar";
  const symbol = currency === "PEN" || currency === "S/" ? "S/" : currency;
  return `${symbol} ${Number(price).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function productSpecs(product: SellableProduct) {
  return product.specs || product.specifications || {};
}

export function toCartItem(product: SellableProduct, quantity = 1): CartItem {
  return {
    productId: product.id || product.slug,
    slug: product.slug,
    name: product.name || product.title || "Producto técnico",
    brand: product.brand,
    model: product.model,
    price: Number(product.price || 0),
    currency: product.currency || "USD",
    image: assetPath(product.mainImage || product.images?.[0]),
    stock: Number(product.stock || 1),
    requiresQuote: Boolean(product.requiresQuote || !product.price),
    quantity: Math.max(1, quantity),
    workspaceId: product.terraqoWorkspaceId,
  };
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartIgv(items: CartItem[]) {
  return getCartSubtotal(items) * 0.18;
}

export function getCartTotal(items: CartItem[], shipping = 0) {
  return getCartSubtotal(items) + getCartIgv(items) + shipping;
}
