import Image from "next/image";
import Link from "next/link";

const serviceLinks = [
  { label: "Levantamientos topograficos", href: "/servicios/topografia-convencional-y-automatizada/" },
  { label: "Escaneo 3D y LiDAR", href: "/servicios/escaneo-laser-3d-lidar-terrestre/" },
  { label: "Control de obras", href: "/servicios/control-geometrico-de-obras/" },
  { label: "Monitoreo y deformaciones", href: "/servicios/monitoreo-de-taludes-y-subsidencias/" },
  { label: "Consultoria tecnica", href: "/servicios/consultoria-en-precision-geometrica/" },
  { label: "Catastro y saneamiento", href: "/servicios/levantamiento-catastral-urbano-y-rural/" },
  { label: "Mas servicios", href: "/servicios/" },
];

const footerRoutes = [
  { label: "Sobre nosotros", href: "/nosotros/" },
  { label: "Casos de exito", href: "/casos-exito/" },
  { label: "Metodo ICC", href: "/metodo-icc/" },
  { label: "Tienda tecnica", href: "/tienda/" },
  { label: "Contacto", href: "/contacto/" },
  { label: "Cuenta cliente", href: "/cuenta/" },
];
const footerUtils = [
  { label: "Trabaja con nosotros", href: "/nosotros/" },
  { label: "Brochure", href: "/casos-exito/" },
  { label: "Libro de reclamaciones", href: "/metodo-icc/" },
  { label: "Preguntas frecuentes", href: "/tienda/" },
  { label: "Terminos y condiciones", href: "/contacto/" },
  { label: "Politica de privacidad y tratamiento de datos", href: "/ppytd/" },
];

const socialLinks = [
  { label: "in", href: "https://www.linkedin.com/" },
  { label: "ig", href: "https://www.instagram.com/" },
  { label: "yt", href: "https://www.youtube.com/" },
];

export default function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="footer-top-strip" aria-hidden="true" />
      <div className="container footer-shell">
        <div className="footer-brand-panel">
          <Image className="footer-logo" src="/brand/icc-topografia-logo.png" alt="ICC Topografia" width={240} height={50} />
          <h4>ICC TOPOGRAFIA GROUP SAC - RUC <span>20-61611631-3</span> </h4>
          <p>Soluciones topograficas con precision, tecnologia y compromiso para cada proyecto.</p>
          <span />

          <div className="footer-contact">
            <h3>Hablemos</h3>
            <a href="https://wa.me/51949844865" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 11.8a8 8 0 0 1-11.6 7.1L4 20l1.2-4.2A8 8 0 1 1 20 11.8Z" />
                <path d="M9.4 8.3c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.4.5c.8 1.4 1.8 2.3 3.2 3l.5-.5c.2-.2.4-.2.7-.1l1.5.7c.3.1.4.3.4.6v.5c0 .3-.1.6-.5.7-.5.2-1.3.3-2.3 0-2.7-.7-5.5-3.3-6.3-6-.3-.9-.1-1.7.1-2.2Z" />
              </svg>
              +51 949 844 865
            </a>
            <a href="mailto:cotizaciones@icctopografia.com">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16v12H4z" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              cotizaciones@icctopografia.com
            </a>
            <a href="mailto:proyectos@icctopografia.com">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              proyectos@icctopografia.com
            </a>
          </div>

          <a className="footer-support" href="/contacto/">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 13a8 8 0 0 1 16 0" />
              <path d="M4 13v4a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2Z" />
              <path d="M20 13v4a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2Z" />
              <path d="M14 21h-4" />
            </svg>
            <span>Soporte tecnico</span>
            <span>-&gt;</span>
          </a>
        </div>

        <nav className="footer-column" aria-label="Servicios del footer">
          <h3>Servicios</h3>
          <i />
          {serviceLinks.map((route) => (
            <Link key={route.href} href={route.href}>
              {route.label}
              <span>-&gt;</span>
            </Link>
          ))}
        </nav>

        <nav className="footer-column" aria-label="Enlaces del footer">
          <h3>Enlaces</h3>
          <i />
          {footerRoutes.map((route) => (
            <Link key={route.href} href={route.href}>
              {route.label}
              <span>-&gt;</span>
            </Link>
          ))}
        </nav>
        <nav className="footer-column" aria-label="utiles del footer">
          <h3>utiles</h3>
          <i />
          {footerUtils.map((route) => (
            <Link key={route.href} href={route.href}>
              {route.label}
              <span>-&gt;</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="footer-bottom">
        <div className="container footer-credits">
          <p>Copyright 2026 ICC Topografia. Todos los derechos reservados.</p>
          <div className="footer-credit-links">
            <a href="https://vrilla.solutions" target="_blank" rel="noreferrer">
              Developed by vrilla.solutions
            </a>
            <a href="https://terraco.com" target="_blank" rel="noreferrer">
              Powered by Terraco
            </a>
          </div>
          <div className="footer-social" aria-label="Redes sociales">
            <span>Siguenos</span>
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
