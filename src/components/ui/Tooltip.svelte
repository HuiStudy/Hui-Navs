<script lang="ts">
  // 统一的 (?) Tooltip。承载「系统逻辑/权限」类说明。
  // 桌面：hover + 键盘聚焦触发；移动端触屏：点按切换（Tap to toggle，OQ-C 方案 1）。
  // (?) 为 button，用 aria-expanded 表达展开态；全局互斥（同一时刻仅一个展开）；
  // 点浮层外区域关闭。
  import { onDestroy } from 'svelte'
  import { nextTooltipId, openTooltipId } from '../../lib/tooltipStore'

  export let text = ''
  export let label = '查看说明'

  const id = nextTooltipId()
  const bubbleId = `${id}-bubble`
  let anchorEl: HTMLElement | null = null
  let open = false
  // hover 与「点按锁定」分离：点按打开后即使移开指针也保持，直到再次点按/点外部/Esc
  let pinned = false
  let hovering = false

  const unsub = openTooltipId.subscribe((current) => {
    // 其它 tooltip 被打开时，收起自己的 pinned 态
    if (current !== id && pinned) {
      pinned = false
    }
    open = pinned || hovering
  })
  onDestroy(unsub)

  function show() {
    hovering = true
    open = true
  }
  function hide() {
    hovering = false
    open = pinned
  }
  function togglePinned() {
    pinned = !pinned
    if (pinned) {
      openTooltipId.set(id)
    } else if (!hovering) {
      openTooltipId.set(null)
    }
    open = pinned || hovering
  }
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && (pinned || open)) {
      pinned = false
      hovering = false
      open = false
      openTooltipId.set(null)
    }
  }
  function handleWindowPointerDown(event: PointerEvent) {
    if (!pinned) return
    if (anchorEl && event.target instanceof Node && anchorEl.contains(event.target)) return
    pinned = false
    open = hovering
    openTooltipId.set(null)
  }
</script>

<svelte:window on:pointerdown={handleWindowPointerDown} on:keydown={handleKeydown} />

<span
  class="ui-tooltip"
  bind:this={anchorEl}
  on:mouseenter={show}
  on:mouseleave={hide}
  role="presentation"
>
  <button
    type="button"
    class="ui-tooltip-trigger"
    aria-label={label}
    aria-expanded={open}
    aria-describedby={open && text ? bubbleId : undefined}
    on:click={togglePinned}
    on:focus={show}
    on:blur={hide}
  >?</button>
  {#if open && text}
    <span id={bubbleId} class="ui-tooltip-bubble" role="tooltip">{text}</span>
  {/if}
</span>

<style>
  .ui-tooltip {
    position: relative;
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }

  .ui-tooltip-trigger {
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--sp-input-border, #cbd5e1);
    border-radius: 50%;
    background: var(--sp-input-bg, #ffffff);
    color: var(--sp-muted, #64748b);
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
  }

  .ui-tooltip-trigger:hover,
  .ui-tooltip-trigger:focus-visible {
    border-color: var(--sp-accent, #2563eb);
    color: var(--sp-accent, #2563eb);
    outline: none;
  }

  .ui-tooltip-bubble {
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    width: max-content;
    max-width: min(260px, 78vw);
    box-sizing: border-box;
    padding: 8px 10px;
    border-radius: 8px;
    background: var(--sp-strong, #1e293b);
    color: #ffffff;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.24);
    pointer-events: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    .ui-tooltip-bubble {
      animation: ui-tooltip-in 0.12s ease;
    }
  }

  @keyframes ui-tooltip-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-2px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
