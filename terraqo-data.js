window.TERRAQO_DATA = {
  services: [
    {
      slug: "levantamiento-topografico",
      title: "Levantamiento topografico",
      summary: "Medicion de terreno, curvas de nivel, planos base y entregables listos para diseno, obra o expediente.",
      metric: "48 h",
      metricLabel: "respuesta referencial",
      deliverables: ["Plano topografico", "Curvas de nivel", "Puntos de control", "Archivo CAD / PDF"],
      applications: ["Obras nuevas", "Habilitaciones urbanas", "Expedientes tecnicos", "Proyectos inmobiliarios"]
    },
    {
      slug: "replanteo-topografico",
      title: "Replanteo de obra",
      summary: "Marcacion precisa de ejes, niveles, puntos de control y elementos constructivos para ejecucion en campo.",
      metric: "QA/QC",
      metricLabel: "control en campo",
      deliverables: ["Ejes replanteados", "Puntos verificados", "Registro de campo", "Reporte de control"],
      applications: ["Edificaciones", "Movimiento de tierras", "Obras viales", "Cimentaciones"]
    },
    {
      slug: "georreferenciacion",
      title: "Georreferenciacion",
      summary: "Control geodesico, puntos de referencia y coordenadas para proyectos que requieren trazabilidad espacial.",
      metric: "GNSS",
      metricLabel: "control geodesico",
      deliverables: ["Puntos georreferenciados", "Sistema de coordenadas", "Memoria tecnica", "Archivos digitales"],
      applications: ["Catastro", "Infraestructura", "Saneamiento", "Control territorial"]
    },
    {
      slug: "control-topografico",
      title: "Control topografico",
      summary: "Seguimiento de avance, verificacion geometrica y control tecnico para reducir desviaciones en obra.",
      metric: "360",
      metricLabel: "seguimiento tecnico",
      deliverables: ["Reportes de avance", "Comparativos", "Observaciones", "Evidencia fotografica"],
      applications: ["Obra civil", "Supervision", "QA/QC", "Contratistas"]
    },
    {
      slug: "catastro-urbano-rural",
      title: "Catastro urbano y rural",
      summary: "Registro, medicion y organizacion territorial para municipalidades, inmobiliarias y proyectos de saneamiento.",
      metric: "GIS",
      metricLabel: "base territorial",
      deliverables: ["Ficha de campo", "Plano catastral", "Base geoespacial", "Reporte tecnico"],
      applications: ["Municipalidades", "Predios", "Saneamiento", "Gestion territorial"]
    },
    {
      slug: "equipos-soporte",
      title: "Equipos y soporte",
      summary: "Venta, alquiler, calibracion y asesoria de equipos topograficos para operaciones tecnicas.",
      metric: "B2B",
      metricLabel: "compra consultiva",
      deliverables: ["Asesoria tecnica", "Ficha de equipo", "Cotizacion", "Soporte postventa"],
      applications: ["Estaciones totales", "GNSS", "Niveles", "Drones"]
    }
  ],
  projects: [
    {
      slug: "lima-airport-topografia-aeroportuaria",
      title: "Lima Airport - topografia aeroportuaria",
      sector: "Infraestructura aeroportuaria",
      location: "Callao, Peru",
      status: "Publicado",
      clientName: "Cliente corporativo",
      image: "./public/images/hero-topografia.jpg",
      gallery: ["./public/images/equipo-topografico.jpg", "./public/images/obra-construccion.jpg", "./public/images/ingenieria-campo.jpg"],
      summary: "Control topografico, replanteo y soporte tecnico para frentes de infraestructura con alta exigencia de precision y coordinacion.",
      challenge: "Coordinar mediciones en un entorno operativo con restricciones de acceso, tolerancias tecnicas exigentes y necesidad de entregables claros para varios equipos.",
      solution: "Se estructuro una metodologia de control con puntos de referencia, validacion de campo, registro de avances y documentacion preparada para coordinacion tecnica.",
      result: "Mediciones trazables; control de ejes y niveles; reportes para coordinacion; evidencia tecnica para decisiones de obra.",
      services: ["Control topografico", "Replanteo", "Georreferenciacion", "Reporte tecnico"],
      metrics: [
        ["Control", "Mediciones trazables"],
        ["QA/QC", "Entregables revisables"],
        ["Operacion", "Campo y gabinete"]
      ],
      progress: [
        ["Planificacion y control", "Definicion de puntos base, restricciones de acceso y entregables esperados."],
        ["Ejecucion de campo", "Levantamiento y verificacion de informacion critica para coordinacion de obra."],
        ["Gabinete y reporte", "Organizacion de resultados, planos y observaciones para seguimiento tecnico."]
      ]
    },
    {
      slug: "obra-infraestructura",
      title: "Obras e infraestructura",
      sector: "Construccion",
      location: "Lima y provincias",
      status: "Publicado",
      clientName: "Constructora / inmobiliaria",
      image: "./public/images/obra-construccion.jpg",
      gallery: ["./public/images/hero-topografia.jpg", "./public/images/equipo-topografico.jpg"],
      summary: "Levantamiento, replanteo y control para edificaciones, habilitaciones urbanas y frentes de obra.",
      challenge: "Reducir incertidumbre en campo durante la etapa de ejecucion y sostener decisiones con informacion verificable.",
      solution: "Trabajo topografico por etapas, registro de puntos, control de avances y entregables organizados para el equipo tecnico.",
      result: "Control de ejes, niveles y entregables tecnicos para avance de obra.",
      services: ["Levantamiento topografico", "Replanteo", "Control topografico"],
      metrics: [["Campo", "Frentes activos"], ["QA/QC", "Revision tecnica"], ["Entrega", "Planos y reportes"]],
      progress: [["Alcance", "Validacion de ubicacion y entregables."], ["Campo", "Medicion y verificacion en obra."], ["Cierre", "Entrega de planos y reporte tecnico."]]
    },
    {
      slug: "ingenieria-gabinete",
      title: "Ingenieria y gabinete",
      sector: "Gabinete tecnico",
      location: "Operacion tecnica",
      status: "Publicado",
      clientName: "Equipo tecnico",
      image: "./public/images/ingenieria-campo.jpg",
      gallery: ["./public/images/equipo-topografico.jpg", "./public/images/obra-construccion.jpg"],
      summary: "Procesamiento tecnico, planos, reportes y documentacion para decisiones de proyecto.",
      challenge: "Transformar informacion de campo en documentos utiles para coordinacion, revision y toma de decisiones.",
      solution: "Procesamiento, ordenamiento de archivos, compatibilidad CAD/PDF y revision de consistencia tecnica.",
      result: "Planos, reportes y documentacion organizada para coordinacion tecnica.",
      services: ["Procesamiento", "Reporte tecnico", "Compatibilidad CAD"],
      metrics: [["Gabinete", "Procesamiento"], ["Formato", "CAD / PDF"], ["Control", "Revision"]],
      progress: [["Recepcion", "Ordenamiento de informacion base."], ["Procesamiento", "Elaboracion de planos y reportes."], ["Revision", "Control de consistencia y entrega final."]]
    },
    {
      slug: "instrumentacion-soporte",
      title: "Instrumentacion y soporte",
      sector: "Equipos",
      location: "Venta, alquiler y soporte",
      status: "Publicado",
      clientName: "Operacion tecnica",
      image: "./public/images/equipo-topografico.jpg",
      gallery: ["./public/images/hero-topografia.jpg", "./public/images/ingenieria-campo.jpg"],
      summary: "Equipos topograficos, soporte tecnico, calibracion y acompanamiento de uso.",
      challenge: "Elegir equipos correctos para la aplicacion real y sostener la operacion con soporte tecnico.",
      solution: "Asesoria consultiva, validacion de uso, alternativas por presupuesto y soporte postventa.",
      result: "Compra consultiva y soporte para operaciones tecnicas de campo.",
      services: ["Venta de equipos", "Alquiler", "Calibracion"],
      metrics: [["B2B", "Compra consultiva"], ["Soporte", "Postventa"], ["Equipos", "Campo"]],
      progress: [["Diagnostico", "Aplicacion y necesidades del cliente."], ["Cotizacion", "Alternativas de equipo y accesorios."], ["Soporte", "Acompanamiento posterior a la compra o alquiler."]]
    }
  ]
};
