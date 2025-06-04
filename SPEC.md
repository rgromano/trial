0. Propósito
Crear un job board en el que los candidatos deben pagar (vía suscripción mensual) para poder postularse. Se ofrece a empresas y recruiters una plataforma ágil de publicación, filtrado y gestión de talento, y a los candidatos un entorno curado con ofertas confiables, potentes filtros y recomendaciones inteligentes.

1. Públicos y roles
RolDescripciónCapacidades clave
CandidatoProfesional que busca empleo.Navegar & filtrar ofertas, pagar su suscripción, postularse (1-click), gestionar historial, recibir notificaciones, borrar cuenta (GDPR).
EmpresaCompañía que publica vacantes.Crear/editar ofertas, ver candidatos aplicados, exportar datos, comprar “boosts” opcionales.
Recruiter externoAgencia o head-hunter.Igual que Empresa + bandeja multi-cliente.
Admin internoStaff de la plataforma.Dashboard BI, moderación de contenido, escalado de soporte, gestión de usuarios/pagos, definición de precios.
SoporteEquipo de Customer Success.Acceso restringido a tickets, logs de pagos y acciones de usuarios.

2. Modelo de negocio
Suscripción mensual única para candidatos (USD, IVA incluido automáticamente).

Stripe Billing con prorrateo y facturación localizada.

Trial opcional de 7 días.

Renovación automática; SCA para tarjetas EU.

Empresas publican gratis (primeras N ofertas); upsell: featured job, homepage banner, acceso a Talent Pool.

Programa de referidos: 10 % de comisión recurrente durante 12 meses al usuario que refiera (candidato o empresa). Gestor de enlaces únicos y payout mensual vía Stripe Connect.

3. Identidad & UX
Look & feel: moderno, minimalista, tipografía sans-serif con acentos “tech-friendly”, colores base neutros + primario dinámico (usar CSS variables para theming).

Accesibilidad: WCAG 2.1 AA; modo claro/oscuro con prefers-color-scheme.

Idiomas: ES y EN; i18n con namespaces por dominio de negocio.

Mobile-first (responsive web); breakpoints: 360 px, 768 px, 1024 px, ≥1440 px.

PWA con Service Worker para offline caching de ofertas navegadas.

4. Frontend – Pantallas & flujos
Landing pública

Hero con buscador básico.

Sección “Cómo funciona” (3 pasos).

Grid de beneficios, testimonios (carrusel), FAQ acordeón, tabla de precios.

Footer con enlaces legales, social, selector idioma.

Listado de ofertas

Filtros laterales colapsables: categoría, stack tech, ubicación, remoto, rango salarial, seniority, tipo de contrato, fecha publicación, tamaño empresa, beneficios, diversidad.

Vista lista (tarjetas horizontales) con: logo, título, empresa, ubicación, salario “hasta” (si se oculta, mostrar “confidencial”), tags skill y fecha.

Barra superior con contador de resultados, orden por relevancia/reciente/salario.

Paginación infinita (virtual scroll).

Detalle de oferta

Encabezado sticky con CTA “Suscríbete para aplicar”.

Secciones: descripción, responsabilidades, requisitos, beneficios, cultura, proceso de selección.

Panel lateral: salario, tipo de jornada, ubicación, skills chips.

Empresa: mini-perfil expandible (otros empleos, enlaces RRSS).

Related jobs (algoritmo ML).

Pay-wall & Checkout

Paso 1: resumen plan + precio + impuestos incluidos.

Paso 2: Stripe Checkout (1-click con Apple Pay/Google Pay).

Paso 3: confirmación + onboarding rápido (completar CV, subir CV PDF, conectar LinkedIn).

Área privada del candidato

Dashboard: “Tu próxima oferta perfecta” (cards recomendadas).

Pestañas:

“Aplicaciones” (timeline estado: enviado, visto, entrevista, oferta, rechazado).

“Suscripción & facturación” (cambiar tarjeta, cancelar, recibos PDF).

“Perfil público” (CV estructurado con secciones drag & drop).

“Referidos” (link tracking, estadísticas).

Área privada de la empresa/recruiter

Panel de control con métricas de cada oferta (nº vistas, nº pagos, ratio postulación).

Editor de ofertas con markdown enriquecido + campos obligatorios.

Gestor de candidatos: tabla con filtros, score, notas internas, export CSV.

Wallet de créditos (para features de pago).

Centro de ayuda

Base de conocimiento (buscable), chat en vivo (widget Intercom-like), formulario de ticket.

5. Arquitectura y stack técnico
CapaTecnología recomendadaMotivo
FrontendTypeScript + React 18, Vite, Zustand para estado global, Next.js 14 App Router (SSR + SSG), TailwindCSS.SSR para SEO, performance; DX moderna.
API GatewayGraphQL (Apollo Federation) + REST fallback.Flexibilidad de agregación y versionado.
ServiciosNode.js 20 (NestJS) o Go (Gin) según microservicio.Performance + ecosistema.
BBDD TransaccionalPostgreSQL 16 con Citus (sharding).ACID + escalar lecturas.
BúsquedaOpenSearch (managed) con sinónimos ES/EN.Filtros complejos, full-text.
CacheRedis 7 (ElastiCache).Sessions, rate-limiting, cola jobs.
Mensajería/eventosKafka (Confluent Cloud).Orquestación entre microservicios.
Procesamiento feedsPython 3.12 (FastAPI) workers.Parsing XML/JSON, NLP enrichment.
CI/CDGitHub Actions → Docker → Kubernetes (EKS) + Argo CD.Blue-green deploy, rollback.
InfraAWS multi-AZ, IaC con Terraform, WAF + CloudFront.Alta disponibilidad, compliance.
ObservabilidadOpenTelemetry → Grafana Cloud (metrics, traces), Sentry (frontend & backend).End-to-end tracing.

Microservicios sugeridos
Auth (JWT + refresh, OAuth 2 / OIDC Social).

Payments (Stripe Webhooks, billing logic).

Jobs (CRUD ofertas, búsqueda).

Applications (lógica de postulación, estados).

Subscriptions (planes, renovaciones).

Profiles (candidato y empresa).

Notifications (fan-out e-mail/SMS/push).

Feed-Ingest (scrape/ATS import, dedupe).

Recommendations (ML, embeddings).

Analytics/Events (tracking clickstream).

6. Procesamiento de feeds
[ATS/API/XML] → Ingest Worker → Staging DB → Deduplicator → Normalizer → Enricher
               ➷ Kafka topic “jobs.raw”
Frecuencia: cada hora (cron-trigger + backoff si falla).

Deduplicación: hash(título+empresa+ubicación+timestamp/24h).

Normalización: taxonomía propia de skills & categorías; UUID estable.

Enriquecimiento:

NLP (spaCy) para extraer skills, seniority, beneficios.

Salary range prediction cuando falta salario.

Publicación: push a jobs.indexed → OpenSearch bulk.

7. Sistema de pagos & wallet
Stripe Billing: product “Candidate Plan”, price mensual USD XX, tax inclusive.

Webhooks críticos: invoice.payment_succeeded, invoice.payment_failed, customer.subscription.updated, charge.refunded.

Tabla subscription_status cacheada en Redis (<10 min) para el pay-gate.

SCA: 3-D Secure 2 con fallback challenge.

Dunning: 3 e-mails + notificación push antes de cancelar.

Pay-link almacenado para reactivación 1-click.

8. Seguridad, privacidad y cumplimiento
GDPR: consentimiento explícito, derecho al olvido (soft-delete + cron hard-delete 30 días).

PCI DSS nivel 1 (delegado a Stripe; nunca manipular PAN).

CSP estricta, HSTS, TLS 1.3 únicamente.

Rate limiting (Redis token bucket) en endpoints sensibles.

Auditoría de acciones admin (admin_logs immutable, S3 + Glacier 1 año).

9. Notificaciones & comunicación
TriggerCanalPlantilla clave
Nuevo pagoE-mail (SendGrid), push web, in-app toastFactura adjunta PDF.
Estado aplicación cambiaE-mail, push“Tu candidatura pasó a Entrevista 🎉”
Renovación próximaE-mail 7 y 1 día antesUpsell a plan anual.
Oferta caducaSlack interno + E-mail empresaRecordatorio renovar/editar.
Nueva oferta que encajaPush, WhatsApp (Twilio)Recomendación personalizada.

10. Dashboard interno (Looker)
Modelo dbt sobre réplicas read-only de PostgreSQL + Kafka sinks (Parquet → S3).

KPIs (LookML Explores):

MRR, ARR, ARPA, LTV, churn.

Conversión funnel: Landing → Registro → Pago → 1ª Aplicación.

Tiempos medios de contratación por empresa.

NPS (encuesta trimestral).

Roles: Finanzas (ver ingresos), Soporte (solo datos usuario+pagos), Moderación (flags de contenido), Marketing (embudos).

11. Algoritmo de recomendación (ML)
Stage 1 – Candidato ↔ Oferta (embedding)

Modelo SBERT fine-tuned en ES/EN (descripción CV vs. descripción oferta).

Stage 2 – Reranking (CTR prediction)

GBDT (LightGBM) con features: seniority_gap, salary_ratio, skill_overlap, interacción histórica usuario.

Online service con Faiss + Redis features store. Latencia < 200 ms (P95).

12. DevOps & CI/CD
PR → Tests (Jest, Playwright e2e, pytest) → Docker build → Snyk scan → Push ECR → Argo CD deploy canary 10 %.

Branch main protegido; develop pre-prod.

Infra versión “git-ops” en Terraform.

SLO: p99 response < 400 ms; uptime 99.9 %.

13. Checklists rápidos
Legal: ToS, Privacy Policy, Cookies banner (IAB TCF v2).

SEO: sitemap.xml, jobs schema.org, pre-render bot.

Analytics: first-party, cookieless fallback, Consent Mode.

Accessibility: contrast ≥ 4.5:1, focus visible, ARIA labels.

Performance: LCP < 2.5 s, CLS < 0.1, TTFB < 200 ms.

Monitoring: synthetic checks en Pingdom + alertas PagerDuty.

