"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { CartItem, formatPrice, getCartIgv, getCartSubtotal, getCartTotal } from "../lib/sellable-store";
import { readCart, writeCart } from "./SellableCartStore";

const shippingOptions = [
  { id: "standard", label: "Envío estándar", detail: "Entrega coordinada 24 - 72 horas", price: 15 },
  { id: "express", label: "Envío express", detail: "Entrega prioritaria 12 - 24 horas", price: 25 },
  { id: "pickup", label: "Recojo en tienda", detail: "Disponible previa coordinación", price: 0 },
];

const paymentOptions = [
  { id: "bank", label: "Transferencia bancaria", detail: "Te enviaremos los datos para realizar el pago." },
  { id: "card", label: "Tarjeta crédito / débito", detail: "Integración de pasarela pendiente de activación." },
  { id: "delivery", label: "Pago contra entrega", detail: "Disponible según zona y validación comercial." },
];

export default function SellableCheckoutClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState(shippingOptions[0]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const igv = useMemo(() => getCartIgv(items), [items]);
  const total = useMemo(() => getCartTotal(items, shipping.price), [items, shipping]);

  useEffect(() => setItems(readCart()), []);

  function updateQuantity(productId: string, quantity: number) {
    const next = items.map((item) => (item.productId === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, Math.max(item.stock, 1))) } : item));
    setItems(next);
    writeCart(next);
  }

  function remove(productId: string) {
    const next = items.filter((item) => item.productId !== productId);
    setItems(next);
    writeCart(next);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    setStatus("loading");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      workspaceSlug: "icc-topografia",
      items,
      totals: { subtotal, igv, shipping: shipping.price, total },
      shippingMethod: shipping.id,
      customerType: formData.get("customerType"),
      paymentMethod: formData.get("paymentMethod"),
      customer: Object.fromEntries(formData.entries()),
    };
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(result?.message || "No se pudo registrar el pedido.");
      return;
    }
    writeCart([]);
    setItems([]);
    setStatus("success");
    setMessage(`Pedido recibido: ${result.id}. Un asesor validará disponibilidad, entrega y pago.`);
  }

  if (!items.length && status !== "success") {
    return (
      <section className="checkout-shell">
        <div className="container checkout-empty">
          <p className="eyebrow">Carrito</p>
          <h1>Tu carrito está vacío.</h1>
          <p>Agrega equipos desde la tienda técnica para iniciar compra o cotización guiada.</p>
          <Link className="button primary" href="/tienda/">Ir a tienda</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-shell">
      <div className="container checkout-grid">
        <form className="checkout-form" onSubmit={submit}>
          <div className="checkout-steps">
            <span className="is-active">1 Entrega</span>
            <span>2 Pago</span>
            <span>3 Confirmación</span>
          </div>
          <div className="checkout-card">
            <p className="eyebrow">Datos de entrega</p>
            <div className="checkout-toggle">
              <label><input type="radio" name="customerType" value="person" defaultChecked /> Persona natural</label>
              <label><input type="radio" name="customerType" value="company" /> Empresa</label>
            </div>
            <div className="checkout-fields">
              <input name="name" required placeholder="Nombres y apellidos" />
              <input name="document" placeholder="DNI / RUC" />
              <input name="email" required type="email" placeholder="Email" />
              <input name="phone" required placeholder="Teléfono / WhatsApp" />
              <input className="wide" name="address" required placeholder="Dirección" />
              <input className="wide" name="reference" placeholder="Referencia opcional" />
              <select name="department" defaultValue="Lima"><option>Lima</option></select>
              <select name="province" defaultValue="Lima"><option>Lima</option></select>
              <select name="district" defaultValue="La Molina"><option>La Molina</option><option>Miraflores</option><option>San Isidro</option></select>
            </div>
          </div>

          <div className="checkout-card">
            <p className="eyebrow">Método de envío</p>
            <div className="option-list">
              {shippingOptions.map((option) => (
                <label className={shipping.id === option.id ? "is-active" : ""} key={option.id}>
                  <input type="radio" name="shippingMethod" value={option.id} checked={shipping.id === option.id} onChange={() => setShipping(option)} />
                  <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                  <b>{option.price ? formatPrice(option.price, "PEN") : "Gratis"}</b>
                </label>
              ))}
            </div>
          </div>

          <div className="checkout-card">
            <p className="eyebrow">Método de pago</p>
            <div className="option-list">
              {paymentOptions.map((option, index) => (
                <label className={index === 0 ? "is-active" : ""} key={option.id}>
                  <input type="radio" name="paymentMethod" value={option.id} defaultChecked={index === 0} />
                  <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                </label>
              ))}
            </div>
          </div>
          <button className="store-action-button primary checkout-submit" disabled={status === "loading"} type="submit">
            {status === "loading" ? "Registrando..." : "Continuar al pago"}
          </button>
          {message ? <p className={`checkout-message ${status}`}>{message}</p> : null}
        </form>

        <aside className="checkout-summary">
          <div className="checkout-card">
            <h2>Resumen del pedido</h2>
            <p>{items.length} producto(s)</p>
            <div className="cart-lines">
              {items.map((item) => (
                <article key={item.productId}>
                  <img src={item.image || "/images/equipo-topografico-store.jpg"} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <small>x{item.quantity}</small>
                    <div className="cart-line-controls">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                      <button type="button" onClick={() => remove(item.productId)}>Quitar</button>
                    </div>
                  </div>
                  <b>{item.requiresQuote ? "Cotizar" : formatPrice(item.price * item.quantity, item.currency)}</b>
                </article>
              ))}
            </div>
            <dl className="checkout-totals">
              <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
              <div><dt>Envío</dt><dd>{formatPrice(shipping.price, "PEN")}</dd></div>
              <div><dt>IGV (18%)</dt><dd>{formatPrice(igv)}</dd></div>
              <div className="total"><dt>Total referencial</dt><dd>{formatPrice(total)}</dd></div>
            </dl>
          </div>
          <div className="checkout-trust">
            <span>Compra 100% segura</span>
            <span>Datos protegidos</span>
            <span>Garantía oficial</span>
            <span>Soporte técnico especializado</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
