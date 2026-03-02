<script lang="ts">
  import type { WidgetTemplate } from './grapes-templates';
  import { WIDGET_TEMPLATES } from './grapes-templates';

  export let onSelect: (template: WidgetTemplate | null) => void = () => {};
</script>

<div class="template-picker">
  <button class="template-card" on:click={() => onSelect(null)}>
    <span class="template-card-name">Blank Canvas</span>
    <span class="template-card-desc">Start from scratch</span>
  </button>
  {#each WIDGET_TEMPLATES as template (template.id)}
    <button class="template-card" on:click={() => onSelect(template)}>
      <span class="template-card-name">{template.name}</span>
      <span class="template-card-desc">{template.description}</span>
    </button>
  {/each}
</div>
