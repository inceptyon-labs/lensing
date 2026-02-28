<script lang="ts">
  export let steps: Array<{ label: string; key: string }> = [];
  export let stepValid: boolean[] = [];
  export let dirty: boolean = false;
  export let onStepChange: (step: number) => void = () => {};
  export let onCancel: () => void = () => {};
  export let onFinish: () => void = () => {};

  let currentStep = 0;
  let showConfirm = false;
  let isPending = false;

  $: if (currentStep >= steps.length) {
    currentStep = Math.max(0, steps.length - 1);
  }

  $: isLastStep = currentStep === steps.length - 1;
  $: currentValid = stepValid[currentStep] ?? false;

  function goNext() {
    if (!currentValid) return;
    if (currentStep < steps.length - 1) {
      currentStep += 1;
      onStepChange(currentStep);
    }
  }

  function goBack() {
    if (currentStep > 0) {
      currentStep -= 1;
      onStepChange(currentStep);
    }
  }

  function handleCancel() {
    if (dirty) {
      showConfirm = true;
    } else {
      onCancel();
    }
  }

  function confirmDiscard() {
    showConfirm = false;
    isPending = true;
    onCancel();
  }

  function dismissConfirm() {
    showConfirm = false;
    isPending = false;
  }

  function handleFinish() {
    if (currentValid) {
      isPending = true;
      onFinish();
    }
  }

  $: isPending = false;
</script>

<div>
  <nav>
    {#each steps as step, i (step.key)}
      <div
        data-testid="step-indicator"
        data-active={currentStep === i ? 'true' : 'false'}
        data-completed={i < currentStep ? 'true' : 'false'}
      >
        <span>{i + 1}</span>
        <span>{step.label}</span>
      </div>
    {/each}
  </nav>

  <div data-testid="wizard-content">
    <slot step={currentStep} />
  </div>

  <div>
    {#if currentStep > 0}
      <button type="button" on:click={goBack}>Back</button>
    {/if}

    <button type="button" disabled={isPending} on:click={handleCancel}>Cancel</button>

    {#if isLastStep}
      <button type="button" disabled={!currentValid || isPending} on:click={handleFinish}
        >Finish</button
      >
    {:else}
      <button type="button" disabled={!currentValid} on:click={goNext}>Next</button>
    {/if}
  </div>

  {#if showConfirm}
    <div
      data-testid="confirm-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <p id="confirm-title">You have unsaved changes. Are you sure you want to discard them?</p>
      <button type="button" disabled={isPending} on:click={confirmDiscard}>Discard</button>
      <button type="button" on:click={dismissConfirm}>Keep editing</button>
    </div>
  {/if}
</div>
