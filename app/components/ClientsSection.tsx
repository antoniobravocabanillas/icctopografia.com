import { clients as fallbackClients } from "../lib/home-data";

export default function ClientsSection({ clients = fallbackClients }: { clients?: typeof fallbackClients }) {
  return (
    <section className="clients-section">
      <div className="clients-backdrop" aria-hidden="true" />
      <div className="container clients-content">
        <div className="clients-intro">
          <p className="eyebrow">Clientes que confian en nosotros</p>
          <h2>Confianza que se construye.</h2>
          <span />
          <p>Trabajamos con empresas lideres que exigen exactitud, control y resultados.</p>
        </div>
        <div className="client-logo-grid" aria-label="Clientes que confian en ICC Topografia">
          {clients.map((client) => (
            <a
              className="client-logo-item"
              key={client.name}
              href={client.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visitar web de ${client.name}`}
            >
              <img src={client.logo} alt={client.name} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
