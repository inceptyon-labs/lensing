/**
 * Widget layout templates for the GrapesJS editor.
 * Pre-built HTML+CSS layouts using data binding placeholders
 * and lensing dark display design system tokens.
 */

export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
}

export const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: 'single-value',
    name: 'Single Value',
    description: 'Large centered number with label and icon',
    html: `<div class="sv-wrapper">
  <span class="sv-icon" data-slot="icon">★</span>
  <span class="sv-value" data-slot="value">{{value}}</span>
  <span class="sv-label" data-slot="label">{{label}}</span>
</div>`,
    css: `.sv-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  min-height: 120px;
  color: var(--starlight, hsl(220, 15%, 90%));
  background: var(--event-horizon, hsl(240, 6%, 7%));
  border-radius: 8px;
}
.sv-icon {
  font-size: 24px;
  color: var(--dim-light, hsl(220, 10%, 62%));
}
.sv-value {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}
.sv-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--dim-light, hsl(220, 10%, 62%));
  text-transform: uppercase;
  letter-spacing: 0.04em;
}`,
  },
  {
    id: 'list',
    name: 'List',
    description: 'Vertical list of items with title',
    html: `<div class="list-wrapper">
  <h2 class="list-title" data-slot="title">{{title}}</h2>
  <ul class="list-items">
    <li class="list-item" data-slot="item">{{item}}</li>
    <li class="list-item">{{item}}</li>
    <li class="list-item">{{item}}</li>
  </ul>
</div>`,
    css: `.list-wrapper {
  padding: 16px;
  color: var(--starlight, hsl(220, 15%, 90%));
  background: var(--event-horizon, hsl(240, 6%, 7%));
  border-radius: 8px;
}
.list-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  line-height: 1.2;
}
.list-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.list-item {
  font-size: 16px;
  padding: 8px 0;
  border-bottom: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12));
  line-height: 1.5;
}`,
  },
  {
    id: 'key-value-grid',
    name: 'Key-Value Grid',
    description: 'Two-column grid of label-value pairs',
    html: `<div class="kv-wrapper">
  <div class="kv-row">
    <span class="kv-label" data-slot="label_1">{{label_1}}</span>
    <span class="kv-value" data-slot="value_1">{{value_1}}</span>
  </div>
  <div class="kv-row">
    <span class="kv-label" data-slot="label_2">{{label_2}}</span>
    <span class="kv-value" data-slot="value_2">{{value_2}}</span>
  </div>
  <div class="kv-row">
    <span class="kv-label" data-slot="label_3">{{label_3}}</span>
    <span class="kv-value" data-slot="value_3">{{value_3}}</span>
  </div>
</div>`,
    css: `.kv-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  padding: 16px;
  color: var(--starlight, hsl(220, 15%, 90%));
  background: var(--event-horizon, hsl(240, 6%, 7%));
  border-radius: 8px;
}
.kv-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12));
}
.kv-label {
  font-size: 14px;
  color: var(--dim-light, hsl(220, 10%, 62%));
  font-weight: 500;
}
.kv-value {
  font-size: 16px;
  font-weight: 600;
}`,
  },
  {
    id: 'image-caption',
    name: 'Image + Caption',
    description: 'Hero image with text overlay',
    html: `<div class="ic-wrapper">
  <img class="ic-image" data-slot="image_url" src="{{image_url}}" alt="" />
  <div class="ic-overlay">
    <span class="ic-caption" data-slot="caption">{{caption}}</span>
  </div>
</div>`,
    css: `.ic-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: var(--event-horizon, hsl(240, 6%, 7%));
}
.ic-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}
.ic-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, hsla(240, 8%, 4%, 0.85));
}
.ic-caption {
  font-size: 16px;
  font-weight: 600;
  color: var(--starlight, hsl(220, 15%, 90%));
  line-height: 1.4;
}`,
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Compact card with icon, title, value, and subtitle',
    html: `<div class="card-wrapper">
  <span class="card-icon">★</span>
  <span class="card-title" data-slot="title">{{title}}</span>
  <span class="card-value" data-slot="value">{{value}}</span>
  <span class="card-subtitle" data-slot="subtitle">{{subtitle}}</span>
</div>`,
    css: `.card-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  color: var(--starlight, hsl(220, 15%, 90%));
  background: var(--event-horizon, hsl(240, 6%, 7%));
  border-radius: 8px;
  border: 1px solid var(--edge, hsla(220, 10%, 50%, 0.12));
}
.card-icon {
  font-size: 20px;
  color: var(--dim-light, hsl(220, 10%, 62%));
  margin-bottom: 4px;
}
.card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--dim-light, hsl(220, 10%, 62%));
}
.card-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}
.card-subtitle {
  font-size: 12px;
  color: var(--faint-light, hsl(220, 8%, 42%));
}`,
  },
];
