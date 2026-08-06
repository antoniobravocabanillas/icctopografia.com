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
  {
    id: "bank",
    label: "Transferencia bancaria",
    detail: "El pedido queda creado. Los datos bancarios se enviarán al perfil del cliente y por correo/WhatsApp.",
  },
  {
    id: "card",
    label: "Tarjeta crédito / débito",
    detail: "El pedido queda creado. El link seguro de pago se enviará al perfil cuando se valide disponibilidad.",
  },
  {
    id: "delivery",
    label: "Pago contra entrega",
    detail: "El pedido queda creado. Un asesor confirmará cobertura, monto final y condiciones de entrega.",
  },
];

type CheckoutResult = {
  id: string;
  reusedOrder?: boolean;
  profile: {
    email: string;
    temporaryPassword?: string | null;
    accountUrl: string;
    status?: "CREATED" | "EXISTING";
  };
  paymentInstructions: string;
};

export default function SellableCheckoutClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [confirmedItems, setConfirmedItems] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState(shippingOptions[0]);
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<CheckoutResult | null>(null);

  const summaryItems = confirmedItems.length ? confirmedItems : items;
  const subtotal = useMemo(() => getCartSubtotal(summaryItems), [summaryItems]);
  const igv = useMemo(() => getCartIgv(summaryItems), [summaryItems]);
  const total = useMemo(() => getCartTotal(summaryItems, shipping.price), [summaryItems, shipping]);

  useEffect(() => setItems(readCart()), []);

  function updateQuantity(productId: string, quantity: number) {
    if (status === "success") return;
    const next = items.map((item) => (item.productId === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, Math.max(item.stock, 1))) } : item));
    setItems(next);
    writeCart(next);
  }

  function remove(productId: string) {
    if (status === "success") return;
    const next = items.filter((item) => item.productId !== productId);
    setItems(next);
    writeCart(next);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length || status === "loading") return;
    setStatus("loading");
    setMessage("");

    const snapshot = items.map((item) => ({ ...item }));
    const formData = new FormData(event.currentTarget);
    const payload = {
      workspaceSlug: "icc-topografia",
      items: snapshot,
      totals: { subtotal: getCartSubtotal(snapshot), igv: getCartIgv(snapshot), shipping: shipping.price, total: getCartTotal(snapshot, shipping.price) },
      shippingMethod: shipping.id,
      customerType: formData.get("customerType"),
      paymentMethod: paymentMethod.id,
      customer: Object.fromEntries(formData.entries()),
    };

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setMessage(data?.message || "No se pudo registrar el pedido. Revisa los datos e inténtalo nuevamente.");
      return;
    }

    setConfirmedItems(snapshot);
    setResult(data);
    setStatus("success");
    setMessage(
      data?.profile?.status === "EXISTING"
        ? "Pedido registrado correctamente. Usaremos el perfil cliente existente para el seguimiento."
        : "Pedido creado correctamente. También se creó el perfil de cliente para dar seguimiento.",
    );
    writeCart([]);
    setItems([]);
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
            <span className={status !== "success" ? "is-active" : "is-done"}>1 Entrega</span>
            <span className={status !== "success" ? "is-active" : "is-done"}>2 Pago</span>
            <span className={status === "success" ? "is-active" : ""}>3 Confirmación</span>
          </div>

          {status === "success" && result ? (
            <div className="checkout-card checkout-confirmation">
              <p className="eyebrow">Pedido confirmado</p>
              <h1>
                {result.profile.status === "EXISTING"
                  ? "Tu pedido fue recibido y quedó asociado a tu perfil cliente."
                  : "Tu pedido fue recibido y tu perfil cliente quedó creado."}
              </h1>
              <p>
                Código de pedido: <strong>{result.id}</strong>. Desde tu perfil recibirás los datos de pago,
                validación de stock, comprobantes, estado de entrega y comunicación comercial.
              </p>
              <div className="client-access-box">
                <span>{result.profile.status === "EXISTING" ? "Perfil cliente existente" : "Acceso cliente creado"}</span>
                <dl>
                  <div><dt>Correo</dt><dd>{result.profile.email}</dd></div>
                  {result.profile.temporaryPassword ? (
                    <div><dt>Contraseña temporal</dt><dd>{result.profile.temporaryPassword}</dd></div>
                  ) : (
                    <div><dt>Acceso</dt><dd>Ingresa con tu contraseña actual o usa recuperar contraseña.</dd></div>
                  )}
                </dl>
                <small>
                  {result.profile.temporaryPassword
                    ? "Por seguridad, el cliente deberá cambiar esta contraseña al ingresar por primera vez."
                    : "No generamos una nueva contraseña para evitar duplicar o sobrescribir el acceso existente."}
                </small>
              </div>
              <div className="payment-next-box">
                <strong>Siguiente paso de pago</strong>
                <p>{result.paymentInstructions}</p>
              </div>
              <div className="checkout-final-actions">
                <Link className="store-action-button primary" href={result.profile.accountUrl}>Ir a mi perfil</Link>
                <Link className="store-action-button ghost" href="/tienda/">Seguir comprando</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="checkout-card">
                <p className="eyebrow">Datos de entrega</p>
                <div className="checkout-toggle">
                  <label><input type="radio" name="customerType" value="person" defaultChecked /> Persona natural</label>
                  <label><input type="radio" name="customerType" value="company" /> Empresa</label>
                </div>
                <div className="checkout-fields">
                  <input name="name" required placeholder="Nombres y apellidos" />
                  <input name="document" required placeholder="DNI / RUC" />
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
                  {paymentOptions.map((option) => (
                    <label className={paymentMethod.id === option.id ? "is-active" : ""} key={option.id}>
                      <input type="radio" name="paymentMethod" value={option.id} checked={paymentMethod.id === option.id} onChange={() => setPaymentMethod(option)} />
                      <span><strong>{option.label}</strong><small>{option.detail}</small></span>
                    </label>
                  ))}
                </div>
              </div>
              <button className="store-action-button primary checkout-submit" disabled={status === "loading"} type="submit">
                {status === "loading" ? "Creando pedido y perfil..." : "Finalizar pedido"}
              </button>
            </>
          )}

          {message ? <p className={`checkout-message ${status}`}>{message}</p> : null}
        </form>

        <aside className="checkout-summary">
          <div className="checkout-card">
            <h2>Resumen del pedido</h2>
            <p>{summaryItems.length} producto(s)</p>
            <div className="cart-lines">
              {summaryItems.map((item) => (
                <article key={item.productId}>
                  <img src={item.image || "/images/equipo-topografico-store.jpg"} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <small>x{item.quantity}</small>
                    {status !== "success" ? (
                      <div className="cart-line-controls">
                        <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                        <button type="button" onClick={() => remove(item.productId)}>Quitar</button>
                      </div>
                    ) : null}
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
