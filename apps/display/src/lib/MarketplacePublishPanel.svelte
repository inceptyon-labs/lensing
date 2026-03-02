<script lang="ts">
  export let githubToken: string | null = null;
  export let onValidate:
    | (() => { valid: boolean; errors: Array<{ field: string; message: string }> })
    | undefined = undefined;
  export let onPublish: (() => Promise<{ url: string }>) | undefined = undefined;

  type Stage = 'idle' | 'publishing' | 'success' | 'error' | 'validation-failed';

  let stage: Stage = 'idle';
  let validationErrors: Array<{ field: string; message: string }> = [];
  let prUrl = '';
  let errorMessage = '';

  const PROGRESS_STAGES = ['Packaging...', 'Uploading...', 'Creating PR...'];
  let progressIndex = 0;
  let publishingText = PROGRESS_STAGES[0];
  let progressTimer: ReturnType<typeof setInterval> | null = null;

  function startProgressCycle() {
    progressIndex = 0;
    publishingText = PROGRESS_STAGES[0];
    progressTimer = setInterval(() => {
      progressIndex = Math.min(progressIndex + 1, PROGRESS_STAGES.length - 1);
      publishingText = PROGRESS_STAGES[progressIndex];
    }, 1500);
  }

  function stopProgressCycle() {
    if (progressTimer !== null) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  }

  async function handlePublish() {
    if (onValidate) {
      const result = onValidate();
      if (!result.valid) {
        validationErrors = result.errors;
        stage = 'validation-failed';
        return;
      }
    }

    stage = 'publishing';
    startProgressCycle();

    try {
      const result = await onPublish?.();
      stopProgressCycle();
      prUrl = result?.url ?? '';
      stage = 'success';
    } catch (err: unknown) {
      stopProgressCycle();
      errorMessage = err instanceof Error ? err.message : 'Publish failed';
      stage = 'error';
    }
  }

  function retry() {
    handlePublish();
  }
</script>

<div class="publish-panel">
  {#if stage === 'idle' || stage === 'validation-failed'}
    <button type="button" class="publish-btn" disabled={!githubToken} on:click={handlePublish}>
      Publish to Marketplace
    </button>

    {#if !githubToken}
      <p class="no-token-msg">Configure GitHub token in Settings to enable publishing.</p>
    {/if}

    {#if stage === 'validation-failed'}
      <ul class="validation-errors">
        {#each validationErrors as error (error.field)}
          <li class="validation-error">{error.message}</li>
        {/each}
      </ul>
    {/if}
  {:else if stage === 'publishing'}
    <p class="progress-text">{publishingText}</p>
  {:else if stage === 'success'}
    <p class="success-msg">Published — awaiting review</p>
    <a class="pr-link" href={prUrl} target="_blank" rel="noopener noreferrer">View pull request</a>
  {:else if stage === 'error'}
    <p class="error-msg">{errorMessage}</p>
    <button type="button" class="retry-btn" on:click={retry}>Retry</button>
  {/if}
</div>
