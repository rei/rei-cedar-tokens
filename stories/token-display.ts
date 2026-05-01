export function tokenSection(title: string, count: number, body: string): string {
  return `
    <section class="cdr-token-section">
      <header class="cdr-token-section-header">
        <h2 class="cdr-token-section-title">${title}</h2>
        <span class="cdr-token-section-count">${count}</span>
      </header>
      ${body}
    </section>`;
}

export function renderTokenPage(sections: string): string {
  return `<div class="cdr-token-root">${sections}</div>`;
}
