export type GuidePageOptions = {
  kicker: string;
  title: string;
  lede: string;
  note?: string;
  sections: string;
  footer?: string;
};

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function codeBlock(code: string): string {
  return `<pre class="cdr-guide-code"><code>${escapeHtml(code.trim())}</code></pre>`;
}

export function card(title: string, body: string): string {
  return `
    <article class="cdr-guide-card">
      <header class="cdr-guide-card-head"><h2 class="cdr-guide-card-title">${title}</h2></header>
      <div class="cdr-guide-card-body">${body}</div>
    </article>`;
}

export function renderGuidePage(options: GuidePageOptions): string {
  return `
<div class="cdr-guide-root">
  <section class="cdr-guide-hero">
    <div class="cdr-guide-kicker">${options.kicker}</div>
    <h1 class="cdr-guide-title">${options.title}</h1>
    <p class="cdr-guide-lede">${options.lede}</p>
    ${options.note ? `<div class="cdr-guide-note">${options.note}</div>` : ''}
  </section>

  <section class="cdr-guide-sections">${options.sections}</section>

  ${options.footer ? `<div class="cdr-guide-footer">${options.footer}</div>` : ''}
</div>`;
}
