window.TERRAQO_DATA = {
  services: [
    {
      slug: "levantamiento-topografico",
      title: "Levantamiento topografico clasico",
      summary: "Medicion de terreno con estacion total y GNSS para planos base, curvas de nivel, volumetria y expedientes tecnicos.",
      metric: "±1-2 cm",
      metricLabel: "precision operativa",
      errorRange: "Sub-cm a centimetros segun control, equipo y condiciones de campo.",
      equipment: ["Estacion total", "GNSS RTK", "Nivel digital", "Control geodesico"],
      deliverables: ["Plano topografico CAD/PDF", "Curvas de nivel", "Puntos de control", "Memoria tecnica"],
      process: ["Revision de alcance y sistema de coordenadas", "Plan de control y medicion en campo", "Procesamiento, QA/QC y entrega"],
      caseStudy: "Base topografica para frentes de infraestructura con entregables listos para diseno y obra.",
      applications: ["Obras nuevas", "Habilitaciones urbanas", "Expedientes tecnicos", "Proyectos inmobiliarios"]
    },
    {
      slug: "lidar",
      title: "Escaneo LiDAR terrestre y UAV",
      summary: "Captura masiva de nube de puntos para superficies, volumenes, fachadas, corredores e infraestructura compleja.",
      metric: "Nube 3D",
      metricLabel: "alta densidad",
      errorRange: "Precision relativa milimetrica-centimetrica segun distancia, control y tecnologia aplicada.",
      equipment: ["Escaner LiDAR terrestre", "UAV LiDAR", "GNSS", "Targets de control"],
      deliverables: ["Nube de puntos", "Ortoimagenes", "Modelo 3D", "Secciones y reportes"],
      process: ["Plan de vuelo o estaciones", "Captura LiDAR y puntos de control", "Registro, limpieza y exportacion tecnica"],
      caseStudy: "Levantamiento de zonas de dificil acceso para reducir tiempo de campo y mejorar trazabilidad visual.",
      applications: ["Infraestructura", "Movimiento de tierras", "As-built", "Corredores viales"]
    },
    {
      slug: "control-de-obra",
      title: "Replanteo y control de obra",
      summary: "Marcacion de ejes, niveles, puntos de control y verificacion geometrica para ejecucion de obra civil.",
      metric: "QA/QC",
      metricLabel: "control en campo",
      errorRange: "Control centimetro a sub-centimetro segun tolerancias del proyecto.",
      equipment: ["Estacion total robotica", "Nivel digital", "GNSS RTK", "Libretas de campo"],
      deliverables: ["Ejes replanteados", "Niveles verificados", "Registro de control", "Reporte de desviaciones"],
      process: ["Validacion de planos y tolerancias", "Replanteo y control por frentes", "Reporte de conformidad y observaciones"],
      caseStudy: "Control de ejes y niveles para reducir retrabajos durante ejecucion de estructuras e instalaciones.",
      applications: ["Edificaciones", "Movimiento de tierras", "Obras viales", "Cimentaciones"]
    },
    {
      slug: "monitoreo",
      title: "Monitoreo de deformaciones",
      summary: "Seguimiento periodico de desplazamientos, asentamientos y deformaciones en estructuras, taludes y obras sensibles.",
      metric: "Series",
      metricLabel: "control temporal",
      errorRange: "Milimetros a centimetros segun red de control, frecuencia y metodo.",
      equipment: ["Estacion total de precision", "Prismas", "Nivel digital", "Hitos de control"],
      deliverables: ["Linea base", "Series de medicion", "Alertas por umbral", "Reporte comparativo"],
      process: ["Diseno de red y puntos testigo", "Campanas de medicion", "Analisis comparativo y alertas"],
      caseStudy: "Monitoreo preventivo para controlar desplazamientos y sostener decisiones de seguridad.",
      applications: ["Taludes", "Estructuras", "Excavaciones", "Infraestructura critica"]
    },
    {
      slug: "cartografia-sig",
      title: "Cartografia y SIG basico",
      summary: "Organizacion de informacion territorial, planos, bases geoespaciales y cartografia tecnica para gestion de proyectos.",
      metric: "GIS",
      metricLabel: "base territorial",
      errorRange: "Exactitud cartografica segun escala, fuente, control y objetivo de uso.",
      equipment: ["GNSS", "Software GIS", "CAD", "Ortoimagenes"],
      deliverables: ["Plano cartografico", "Base geoespacial", "Ficha tecnica", "Archivos SHP/KML/CAD"],
      process: ["Definicion de capas y fuentes", "Captura o depuracion de informacion", "Entrega cartografica y documentacion"],
      caseStudy: "Base geoespacial para ordenar predios, frentes de trabajo y activos territoriales.",
      applications: ["Catastro", "Predios", "Gestion territorial", "Saneamiento"]
    }
  ],
  projects: [
    {
      slug: "lima-airport-topografia-aeroportuaria",
      title: "Lima Airport - topografia aeroportuaria",
      sector: "Infraestructura aeroportuaria",
      location: "Callao, Peru",
      status: "Caso publicado",
      clientName: "Cliente corporativo",
      image: "./public/images/hero-topografia.jpg",
      gallery: ["./public/images/equipo-topografico.jpg", "./public/images/obra-construccion.jpg", "./public/images/ingenieria-campo.jpg"],
      summary: "Control topografico, replanteo y soporte tecnico para frentes de infraestructura con alta exigencia de precision y coordinacion.",
      challenge: "Coordinar mediciones en un entorno operativo con restricciones de acceso, tolerancias tecnicas exigentes y necesidad de entregables claros para varios equipos.",
      solution: "Se estructuro una metodologia de control con puntos de referencia, validacion de campo, registro de avances y documentacion preparada para coordinacion tecnica.",
      result: "Mediciones trazables; control de ejes y niveles; reportes para coordinacion; evidencia tecnica para decisiones de obra.",
      services: ["Control de obra", "Replanteo", "Georreferenciacion", "Reporte tecnico"],
      metrics: [["Precision", "Control trazable"], ["QA/QC", "Entregables revisables"], ["Operacion", "Campo y gabinete"]],
      progress: [
        ["Planificacion y control", "Definicion de puntos base, restricciones de acceso y entregables esperados."],
        ["Ejecucion de campo", "Levantamiento y verificacion de informacion critica para coordinacion de obra."],
        ["Gabinete y reporte", "Organizacion de resultados, planos y observaciones para seguimiento tecnico."]
      ]
    },
    {
      slug: "control-topografico-edificacion",
      title: "Control topografico para edificacion",
      sector: "Construccion",
      location: "Lima, Peru",
      status: "Caso publicado",
      clientName: "Constructora / inmobiliaria",
      image: "./public/images/obra-construccion.jpg",
      gallery: ["./public/images/hero-topografia.jpg", "./public/images/equipo-topografico.jpg"],
      summary: "Replanteo, verificacion de niveles y control geometrico para reducir retrabajos durante la ejecucion de obra.",
      challenge: "Sostener tolerancias de ejecucion en varios frentes y convertir observaciones de campo en decisiones rapidas.",
      solution: "Control por hitos, reporte de desviaciones y evidencia fotografica asociada a cada frente de trabajo.",
      result: "Menos retrabajo; ejes verificados; niveles controlados; informacion disponible para supervision.",
      services: ["Replanteo", "Control de obra", "Nivelacion", "QA/QC"],
      metrics: [["Tolerancia", "Control cm"], ["Frentes", "Obra activa"], ["Entrega", "Reporte tecnico"]],
      progress: [["Alcance", "Validacion de planos, ejes y tolerancias."], ["Campo", "Marcacion y verificacion de puntos criticos."], ["Cierre", "Reporte de conformidad y observaciones."]]
    },
    {
      slug: "base-cartografica-sig-predial",
      title: "Base cartografica SIG predial",
      sector: "Cartografia y SIG",
      location: "Lima y provincias",
      status: "Caso publicado",
      clientName: "Operacion territorial",
      image: "./public/images/ingenieria-campo.jpg",
      gallery: ["./public/images/equipo-topografico.jpg", "./public/images/obra-construccion.jpg"],
      summary: "Organizacion de informacion territorial, puntos de control y entregables GIS/CAD para gestion predial y tecnica.",
      challenge: "Unificar informacion dispersa y convertirla en una base territorial util para decisiones tecnicas.",
      solution: "Levantamiento de control, depuracion de capas, validacion espacial y entrega de archivos GIS/CAD.",
      result: "Base geoespacial ordenada; planos tecnicos; informacion lista para gestion y seguimiento.",
      services: ["Cartografia", "SIG basico", "GNSS", "Plano tecnico"],
      metrics: [["Base", "GIS/CAD"], ["Control", "GNSS"], ["Uso", "Gestion territorial"]],
      progress: [["Datos", "Revision de fuentes y estructura de capas."], ["Control", "Validacion espacial y puntos de referencia."], ["Entrega", "Base cartografica y documentacion tecnica."]]
    }
  ]
};
