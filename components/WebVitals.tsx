"use client";

import { useReportWebVitals } from "next/web-vitals";

// Registra en la consola del navegador las métricas Core Web Vitals
// (LCP, CLS, INP, FCP, TTFB) de cada página. Útil para comparar con
// el reporte de Lighthouse y detectar regresiones durante el desarrollo.
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production" || window.location.hostname === "localhost") {
      console.info(`[web-vitals] ${metric.name}: ${Math.round(metric.value * 100) / 100} (${metric.rating})`);
    }
  });
  return null;
}
