"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  sender: string;
  body: string;
};

type ChatConversation = {
  id: string;
  status: "WAITING" | "ACTIVE" | "CLOSED";
  assignedProfile?: { displayName: string; roleTitle: string } | null;
  assignedTo?: { name?: string | null; email?: string | null } | null;
  messages: ChatMessage[];
};

type BotMessage = {
  sender: "customer" | "bot";
  body: string;
};

const storageKey = "icc-topografia-terraqo-chat";

const topics = [
  "Cotizar servicio topografico",
  "Seguimiento de cotizacion",
  "Proyecto en ejecucion",
  "Tienda tecnica",
  "Soporte o consulta tecnica",
];

export default function TerraqoChatEmbed() {
  const [open, setOpen] = useState(false);
  const [humanFormOpen, setHumanFormOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messageBody, setMessageBody] = useState("");
  const [botInput, setBotInput] = useState("");
  const [botConversationId, setBotConversationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [botMessages, setBotMessages] = useState<BotMessage[]>([
    {
      sender: "bot",
      body: "Hola. Soy el asistente de ICC Topografia conectado a Portal Terraqo. Puedo orientarte o derivarte con un asesor.",
    },
  ]);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const assignedName =
    conversation?.assignedProfile?.displayName ||
    conversation?.assignedTo?.name ||
    conversation?.assignedTo?.email ||
    "";
  const assignedRole = conversation?.assignedProfile?.roleTitle || "Asesor ICC";
  const hasAdminReply = Boolean(conversation?.messages.some((message) => message.sender === "admin"));
  const isOnline = conversation?.status === "ACTIVE" || hasAdminReply;

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) setConversationId(stored);
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    async function loadConversation() {
      const response = await fetch(`/api/terraqo/chat?conversationId=${encodeURIComponent(conversationId)}`, {
        cache: "no-store",
      });
      const result = await response.json().catch(() => null);

      if (response.ok && result?.conversation) {
        if (result.conversation.status === "CLOSED") {
          resetConversation("La conversacion anterior fue cerrada. Puedes iniciar una nueva solicitud cuando quieras.");
          return;
        }
        setConversation(result.conversation);
        return;
      }

      if (response.status === 404) {
        resetConversation("No encontramos la conversacion anterior. Puedes iniciar un nuevo chat.");
      }
    }

    loadConversation();
    const interval = window.setInterval(loadConversation, 4000);
    return () => window.clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation?.messages.length, open, botMessages.length]);

  function resetConversation(nextNotice?: string) {
    window.localStorage.removeItem(storageKey);
    setConversationId("");
    setConversation(null);
    setMessageBody("");
    if (nextNotice) setNotice(nextNotice);
  }

  function submitOnEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  async function askBot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = botInput.trim();
    if (!question || loading) return;

    setBotInput("");
    setLoading(true);
    setError("");
    setBotMessages((messages) => [...messages, { sender: "customer", body: question }]);

    const response = await fetch("/api/terraqo/chatbot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, conversationId: botConversationId }),
    });
    const result = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(result?.error?.message || "No pudimos consultar al asistente.");
      return;
    }

    if (result?.conversationId) setBotConversationId(result.conversationId);
    setBotMessages((messages) => [...messages, { sender: "bot", body: result?.answer || "Puedo derivarte con un asesor." }]);

    if (result?.escalatedChatId) {
      window.localStorage.setItem(storageKey, result.escalatedChatId);
      setConversationId(result.escalatedChatId);
      setNotice("Derivamos tu consulta a un asesor. Puedes continuar desde esta ventana.");
    }
  }

  async function startConversation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setNotice("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/terraqo/chat", { method: "POST", body: formData });
    const result = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(result?.error?.message || "No pudimos iniciar el chat.");
      return;
    }

    const id = String(result?.conversationId || "");
    if (id) window.localStorage.setItem(storageKey, id);
    setConversationId(id);
    setConversation(result.conversation);
    setHumanFormOpen(false);
    formRef.current?.reset();
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = messageBody.trim();
    if (!conversationId || !body || loading) return;

    setLoading(true);
    setError("");
    setNotice("");

    const formData = new FormData();
    formData.set("conversationId", conversationId);
    formData.set("body", body);
    const response = await fetch("/api/terraqo/chat", { method: "POST", body: formData });
    const result = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      if (response.status === 409) resetConversation(result?.error?.message || "La conversacion fue cerrada.");
      else setError(result?.error?.message || "No pudimos enviar el mensaje.");
      return;
    }

    setMessageBody("");
    const refreshed = await fetch(`/api/terraqo/chat?conversationId=${encodeURIComponent(conversationId)}`, {
      cache: "no-store",
    });
    const refreshedResult = await refreshed.json().catch(() => null);
    if (refreshed.ok && refreshedResult?.conversation) setConversation(refreshedResult.conversation);
  }

  return (
    <aside className="terraqo-chat" aria-live="polite">
      {open ? (
        <section className="terraqo-chat-panel" aria-label="Chat Portal Terraqo">
          <header className="terraqo-chat-header">
            <div>
              <span>Portal Terraqo</span>
              <strong>{assignedName || "Asesor ICC Topografia"}</strong>
              <small>{conversation?.status === "CLOSED" ? "Conversacion cerrada" : isOnline ? `${assignedRole} en linea` : "Asistencia comercial y tecnica"}</small>
            </div>
            <button type="button" aria-label="Cerrar chat" onClick={() => setOpen(false)}>
              x
            </button>
          </header>

          <div className="terraqo-chat-body">
            {conversationId ? (
              <>
                <div ref={messagesRef} className="terraqo-chat-messages">
                  {conversation?.messages.map((message) => (
                    <article key={message.id} className={message.sender === "admin" ? "from-admin" : "from-client"}>
                      {message.sender === "admin" ? <span>{assignedName || "ICC Topografia"}</span> : null}
                      <p>{message.body}</p>
                    </article>
                  ))}
                </div>
                {!hasAdminReply && conversation?.status !== "CLOSED" ? (
                  <p className="terraqo-chat-notice">Solicitud recibida. Un asesor tomara la conversacion desde Portal Terraqo.</p>
                ) : null}
                <form className="terraqo-chat-send" onSubmit={sendMessage}>
                  <input
                    value={messageBody}
                    onChange={(event) => setMessageBody(event.target.value)}
                    placeholder="Escribe tu mensaje"
                    disabled={conversation?.status === "CLOSED"}
                  />
                  <button type="submit" disabled={loading || !messageBody.trim() || conversation?.status === "CLOSED"}>
                    Enviar
                  </button>
                </form>
              </>
            ) : (
              <>
                <div ref={messagesRef} className="terraqo-chat-messages is-bot">
                  {botMessages.map((message, index) => (
                    <article key={`${message.sender}-${index}`} className={message.sender === "bot" ? "from-admin" : "from-client"}>
                      <p>{message.body}</p>
                    </article>
                  ))}
                </div>
                <form className="terraqo-chat-send" onSubmit={askBot}>
                  <input
                    value={botInput}
                    onChange={(event) => setBotInput(event.target.value)}
                    placeholder="Pregunta sobre servicios o cotizaciones"
                  />
                  <button type="submit" disabled={loading || !botInput.trim()}>
                    Enviar
                  </button>
                </form>
                <button className="terraqo-chat-human" type="button" onClick={() => setHumanFormOpen((value) => !value)}>
                  {humanFormOpen ? "Ocultar solicitud" : "Hablar con un asesor"}
                </button>
                {humanFormOpen ? (
                  <form ref={formRef} className="terraqo-chat-start" onSubmit={startConversation}>
                    <input required name="name" placeholder="Nombre y apellido" autoComplete="name" />
                    <input name="email" type="email" placeholder="Correo corporativo" autoComplete="email" />
                    <input name="phone" placeholder="Telefono / WhatsApp" autoComplete="tel" />
                    <select name="topic" defaultValue={topics[0]}>
                      {topics.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                    <textarea required name="body" placeholder="Cuentanos que necesitas" onKeyDown={submitOnEnter} />
                    <button type="submit" disabled={loading}>{loading ? "Conectando..." : "Iniciar chat"}</button>
                  </form>
                ) : null}
              </>
            )}
            {notice ? <p className="terraqo-chat-notice">{notice}</p> : null}
            {error ? <p className="terraqo-chat-error">{error}</p> : null}
          </div>
        </section>
      ) : null}

      <button className="terraqo-chat-toggle" type="button" aria-label={open ? "Cerrar chat Terraqo" : "Abrir chat Terraqo"} onClick={() => setOpen((value) => !value)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
          <path d="M4.5 12.2c0-4.2 3.4-7.2 7.7-7.2s7.3 2.9 7.3 6.9-3.1 7-7.3 7c-.8 0-1.7-.1-2.4-.4l-4 1.2 1.1-3.4a6.7 6.7 0 0 1-2.4-4.1Z" />
          <path d="M8.3 11.7h7.4M8.3 14.5h4.8" />
        </svg>
        <span>Chat Terraqo</span>
      </button>
    </aside>
  );
}
