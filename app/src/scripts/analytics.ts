const measurementId = 'G-RPXX4TMRSH';
const productionHosts = new Set(['willchavez.com', 'www.willchavez.com']);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    willAnalyticsInitialized?: boolean;
  }
}

export function initAnalytics() {
  // The same static build is used for preview. Keep review/local visits out of
  // the production property and initialize only once across Astro page swaps.
  if (!productionHosts.has(location.hostname) || window.willAnalyticsInitialized) return;
  window.willAnalyticsInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function (..._args: unknown[]) {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  // This property's Enhanced Measurement has page/history tracking enabled.
  // Google handles initial loads and Astro's pushState/popstate navigation;
  // additional manual page_view calls would count those navigations twice.
  window.gtag('config', measurementId);
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  tag.dataset.siteAnalytics = '';
  document.head.append(tag);
}
