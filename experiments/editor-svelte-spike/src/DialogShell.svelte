<script>
  /*
   * The modal shell every product dialog renders through: the `<dialog>`
   * element itself, its heading row, and the close semantics around it.
   *
   * What lives here is deliberately everything that does *not* depend on what
   * the dialog is about — showing the modal, restoring focus, backdrop and
   * close-button dismissal, and notifying the host exactly once. Time's
   * estimate detail and the custom-theme palette have nothing in common
   * inside the panel, but they had byte-identical heading markup and three
   * separate hand-rolled versions of these mechanics before this component
   * existed, which is the drift the one-UI-source rule exists to stop.
   *
   * What does NOT live here: anything the panel is about. Fields, units,
   * formats, tabs, validation, tone and what a module commits stay with the
   * host — a shell that understood those would be a general-purpose form
   * engine grown from whichever case happened to be written first.
   *
   * There is no `idle`/`analyzing`/`saving`/`error`/`dirty` state machine
   * here yet, though the assessment design expects one to land here
   * eventually (`Documentation/AssessmentModuleArchitecturePlan.md`). Time's
   * dialog has no independent save — it applies drafts into the global edit
   * session, which owns its own SaveBar — so there is currently exactly one
   * real case for it, `DeliverySaveConfirmation.svelte`'s `busy` flag, and
   * one case is not enough to shape a contract from. Fold it in when a
   * second panel genuinely needs to block its own close.
   */
  export let open = false;
  export let id = null;
  export let dialogClass = "";
  export let kicker = "";
  export let title = "";
  export let titleId;
  export let closeLabel = "關閉";
  export let onClose = () => {};

  let dialogEl;
  let returnFocusEl = null;
  let closeNotified = false;

  // The dialog element is structurally conditional on `open` (see the `{#if
  // open}` below) rather than a permanently-mounted element toggled via an
  // imperative `showModal()`/`close()` call reacting to a prop change.
  //
  // That is deliberate, not a style choice. Hosts mount these components
  // imperatively (see `viewer-adapter.svelte.js`) with props coming from an
  // externally mutated `$state` object, and in that setup a `$:` block or an
  // action's `update(open)` parameter reading the `open` prop only
  // re-evaluates once after mount — later changes are silently missed, even
  // though the same prop correctly drives ordinary template bindings
  // (confirmed by comparing against a `data-open` attribute, which kept
  // updating correctly every time). Structural `{#if}` toggling does not have
  // that gap: Svelte's own block (dis)connection is what fires the action's
  // `mount`, so this always gets a fresh call.
  function openOnMount(node) {
    returnFocusEl = node.ownerDocument.activeElement;
    closeNotified = false;
    node.showModal();
  }

  function notifyClose() {
    if (closeNotified) return;
    closeNotified = true;
    const focusTarget = returnFocusEl;
    returnFocusEl = null;
    onClose();
    queueMicrotask(() => {
      if (focusTarget?.isConnected) focusTarget.focus();
    });
  }

  // The close button and the backdrop click call `onClose` directly rather
  // than relying solely on the native `close` event that `dialogEl.close()`
  // fires. Both still call `.close()` too, for the native visual dismissal,
  // but the direct call is what actually notifies the host — these are
  // user-initiated actions we already have a synchronous JS hook for, so
  // routing them exclusively through an event round-trip is unnecessary
  // indirection. `onclose={notifyClose}` below stays wired as a fallback for
  // a close this component didn't initiate itself (ESC, a `<form
  // method="dialog">` submit), and `closeNotified` keeps the two paths from
  // notifying twice.
  function requestClose() {
    dialogEl?.close();
    notifyClose();
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) requestClose();
  }
</script>

{#if open}
<dialog
  class={dialogClass ? `theme-dialog ${dialogClass}` : "theme-dialog"}
  {id}
  aria-labelledby={titleId}
  bind:this={dialogEl}
  use:openOnMount
  onclose={notifyClose}
  onclick={handleBackdropClick}
>
  <div class="theme-dialog-heading">
    <div>
      <p class="section-kicker">{kicker}</p>
      <h2 id={titleId}>{title}</h2>
    </div>
    <button class="theme-close" type="button" aria-label={closeLabel} onclick={requestClose}>
      <span aria-hidden="true">×</span>
    </button>
  </div>
  <slot />
</dialog>
{/if}
