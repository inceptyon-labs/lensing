<script lang="ts">
  import '../lib/styles/global.css';
  import type { Snippet } from 'svelte';
  import AdminTokenPrompt from '../lib/AdminTokenPrompt.svelte';

  let { children }: { children: Snippet } = $props();
</script>

{@render children()}
<AdminTokenPrompt />
