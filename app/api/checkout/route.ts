import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

function temporaryPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  return Array.from(randomBytes(12), (value) => alphabet[value % alphabet.length]).join("");
}

function paymentInstructions(method: string) {
  if (method === "card") {
    return "Cuando el asesor valide stock y monto final, enviaremos al perfil del cliente un enlace seguro de pago con tarjeta.";
  }
  if (method === "delivery") {
    return "El equipo comercial validará cobertura de pago contra entrega y publicará la confirmación en el perfil del cliente.";
  }
  return "Los datos de transferencia bancaria, CCI e instrucciones para adjuntar comprobante se enviarán al perfil del cliente.";
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload?.items?.length || !payload?.customer?.email || !payload?.customer?.phone || !payload?.customer?.document) {
    return NextResponse.json({ message: "Pedido incompleto. Falta cliente, documento, teléfono o productos." }, { status: 400 });
  }

  const id = `ICC-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const password = temporaryPassword();

  return NextResponse.json({
    ok: true,
    id,
    workspaceSlug: payload.workspaceSlug || "icc-topografia",
    status: "PENDING_PAYMENT_INSTRUCTIONS",
    profile: {
      email: payload.customer.email,
      temporaryPassword: password,
      accountUrl: "/cuenta/",
      role: "CUSTOMER",
    },
    paymentInstructions: paymentInstructions(payload.paymentMethod),
    note: "Pedido y perfil cliente preparados para sincronizar con Terraqo Orders API por workspace.",
  });
}
