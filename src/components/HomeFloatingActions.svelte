<script lang="ts">
  import { onMount } from 'svelte'
  import type { ThemeMode } from '../../shared/types'

  type AsyncVoid<T = void> = T | Promise<T>
  const BACK_TO_TOP_VISIBILITY_OFFSET = 320

  export let isAuthenticated = false
  export let authLoading = false
  export let activeTheme: 'light' | 'dark' = 'light'
  export let activeThemeMode: ThemeMode = 'auto'
  export let onToggleTheme: (() => AsyncVoid) | undefined = undefined
  export let onSwitchToAdmin: (() => AsyncVoid) | undefined = undefined
  export let onLogout: (() => AsyncVoid) | undefined = undefined
  export let onOpenLogin: (() => AsyncVoid) | undefined = undefined
  export let topNavigation = false
  export let bookmarksVisible = true
  export let onToggleBookmarks: (() => AsyncVoid) | undefined = undefined

  let showBackToTop = false

  $: currentThemeLabel = activeThemeMode === 'auto'
    ? `跟随系统，当前${activeTheme === 'dark' ? '暗色' : '浅色'}`
    : activeThemeMode === 'dark' ? '暗色模式' : '浅色模式'
  $: nextThemeLabel = activeThemeMode === 'light'
    ? '暗色模式'
    : activeThemeMode === 'dark' ? '跟随系统' : '浅色模式'
  $: themeToggleLabel = `当前${currentThemeLabel}，点击切换到${nextThemeLabel}`
  $: themeToggleIcon = activeThemeMode === 'auto' ? 'A' : activeTheme === 'dark' ? '☾' : '☀'

  function handleToggleTheme() {
    void onToggleTheme?.()
  }

  function handleToggleBookmarks() {
    void onToggleBookmarks?.()
  }

  function handleSwitchToAdmin() {
    void onSwitchToAdmin?.()
  }

  function handleLogout() {
    void onLogout?.()
  }

  function handleOpenLogin() {
    void onOpenLogin?.()
  }

  function updateBackToTopVisibility() {
    showBackToTop = window.scrollY > BACK_TO_TOP_VISIBILITY_OFFSET
  }

  function handleBackToTop() {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    window.scrollTo({ top: 0, behavior })
  }

  onMount(() => {
    updateBackToTopVisibility()
    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true })

    return () => window.removeEventListener('scroll', updateBackToTopVisibility)
  })
</script>

<div class="floating-actions" class:below-top-navigation={topNavigation}>
  <button
    type="button"
    class="icon-button theme-toggle-button"
    data-testid="home-theme-toggle"
    class:is-dark={activeTheme === 'dark'}
    class:is-auto={activeThemeMode === 'auto'}
    on:click={handleToggleTheme}
    title={themeToggleLabel}
    aria-label={themeToggleLabel}
  >
    {themeToggleIcon}
  </button>
  <button
    type="button"
    class="icon-button"
    data-testid="home-bookmarks-toggle"
    on:click={handleToggleBookmarks}
    title={bookmarksVisible ? '隐藏书签' : '显示书签'}
    aria-label={bookmarksVisible ? '隐藏书签' : '显示书签'}
  >
    {#if bookmarksVisible}
       <!-- 书签可见 → 显示日历图标（点击后隐藏书签） -->
      <svg t="1788515495104" class="toggle-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M865.8 924.2H161.2c-34.3 0-62.2-27.9-62.2-62.2V217.2c0-34.3 27.9-62.2 62.2-62.2h704.6c34.3 0 62.2 27.9 62.2 62.2V862c0 34.3-27.9 62.2-62.2 62.2zM161.2 196.5c-11.4 0-20.7 9.3-20.7 20.7V862c0 11.4 9.3 20.7 20.7 20.7h704.6c11.4 0 20.7-9.3 20.7-20.7V217.2c0-11.4-9.3-20.7-20.7-20.7H161.2z" fill="currentColor"/>
        <path d="M119.8 390.2h772.6v41.4H119.8zM260 533.9h87.8v87.8H260zM469.6 533.9h87.8v87.8h-87.8zM679.3 533.9h87.8v87.8h-87.8z" fill="currentColor"/>
        <path d="M260 685.8h87.8v87.8H260zM469.6 685.8h87.8v87.8h-87.8zM679.3 685.8h87.8v87.8h-87.8z" fill="currentColor"/>
        <path d="M333.6 251.7c-11.4 0-20.7-9.3-20.7-20.7V120.5c0-11.4 9.3-20.7 20.7-20.7s20.7 9.3 20.7 20.7V231c0 11.5-9.3 20.7-20.7 20.7zM693.5 251.7c-11.4 0-20.7-9.3-20.7-20.7V120.5c0-11.4 9.3-20.7 20.7-20.7s20.7 9.3 20.7 20.7V231c0 11.5-9.3 20.7-20.7 20.7z" fill="currentColor"/>
      </svg>
    {:else}
      <!-- 书签隐藏 → 显示沙漏图标（点击后显示书签） -->
      <svg t="1788515691196" class="toggle-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path d="M848.213333 452.266667H85.333333c-11.946667 0-22.186667-8.533333-25.6-20.48-3.413333-11.946667 3.413333-23.893333 13.653334-29.013334 3.413333-1.706667 75.093333-39.253333 75.093333-134.826666S76.8 136.533333 73.386667 134.826667c-10.24-5.12-15.36-17.066667-13.653334-29.013334 3.413333-11.946667 13.653333-18.773333 25.6-18.773333h762.88c3.413333 0 8.533333 1.706667 11.946667 3.413333 3.413333 1.706667 104.106667 52.906667 104.106667 180.906667s-98.986667 177.493333-104.106667 180.906667c-3.413333-1.706667-6.826667 0-11.946667 0z m-692.906666-51.2h687.786666c17.066667-10.24 71.68-49.493333 71.68-131.413334 0-81.92-54.613333-121.173333-71.68-131.413333H155.306667c23.893333 29.013333 46.08 71.68 46.08 131.413333s-22.186667 102.4-46.08 131.413334zM938.666667 945.493333H175.786667c-3.413333 0-8.533333-1.706667-11.946667-3.413333-3.413333-1.706667-104.106667-52.906667-104.106667-180.906667S158.72 583.68 163.84 580.266667c3.413333 1.706667 6.826667 0 11.946667 0H938.666667c11.946667 0 22.186667 8.533333 25.6 20.48 3.413333 11.946667-3.413333 23.893333-13.653334 29.013333-3.413333 1.706667-75.093333 40.96-75.093333 134.826667 0 95.573333 75.093333 133.12 75.093333 134.826666 10.24 5.12 15.36 17.066667 13.653334 29.013334-3.413333 8.533333-13.653333 17.066667-25.6 17.066666z m-756.053334-51.2H870.4c-23.893333-29.013333-46.08-71.68-46.08-131.413333s22.186667-102.4 46.08-131.413333H182.613333c-17.066667 10.24-71.68 49.493333-71.68 131.413333 0 81.92 54.613333 121.173333 71.68 131.413333z" fill="currentColor"/>
      </svg>
    {/if}
  </button>
  {#if isAuthenticated}
    <button
      type="button"
      class="icon-button"
      data-testid="home-admin-button"
      on:click={handleSwitchToAdmin}
      title="管理后台"
      aria-label="管理后台"
    >
      &#9881;
    </button>
    <button
      type="button"
      class="icon-button"
      data-testid="home-logout-button"
      on:click={handleLogout}
      disabled={authLoading}
      title="退出登录"
      aria-label="退出登录"
    >
      &#8618;
    </button>
  {:else}
    <button
      type="button"
      class="icon-button"
      data-testid="home-login-button"
      on:click={handleOpenLogin}
      title="管理员登录"
      aria-label="管理员登录"
    >
      &#9881;
    </button>
  {/if}
</div>

{#if showBackToTop}
  <button
    type="button"
    class="icon-button back-to-top-button"
    data-testid="home-back-to-top"
    on:click={handleBackToTop}
    title="回到顶部"
    aria-label="回到顶部"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 14.5 12 9l5.5 5.5" />
    </svg>
  </button>
{/if}

<style>
  .floating-actions {
    position: fixed;
    top: 1.25rem;
    right: 1.25rem;
    z-index: 70;
    display: flex;
    gap: 0.5rem;
  }

  /* 顶部导航模式：与固定导航栏（top:12px、高 52px）首行垂直居中对齐。
     悬浮在导航栏之上（z-index 70 > 导航栏 60），宽视口右缘重叠时不被遮挡（OQ-C2）。 */
  .floating-actions.below-top-navigation {
    top: 1.125rem;
  }

  .back-to-top-button {
    position: fixed;
    right: max(1.25rem, env(safe-area-inset-right));
    bottom: max(1.25rem, env(safe-area-inset-bottom));
    z-index: 50;
    color: #2563eb;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.14);
  }

  .back-to-top-button svg {
    width: 1.35rem;
    height: 1.35rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .icon-button {
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid rgba(148, 163, 184, 0.28);
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.82);
    font-size: 1.15rem;
    line-height: 1;
    cursor: pointer;
    transition: background var(--transition-base), border-color var(--transition-base), transform var(--transition-base);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .icon-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(37, 99, 235, 0.45);
    transform: translateY(-1px);
  }

  .toggle-icon {
    width: 1.2rem;
    height: 1.2rem;
    flex-shrink: 0;
  }

  .theme-toggle-button {
    color: #0f172a;
    font-weight: 700;
  }

  .theme-toggle-button.is-dark {
    background: rgba(15, 23, 42, 0.82);
    color: #e5eefb;
  }

  .theme-toggle-button.is-auto {
    background: rgba(14, 165, 233, 0.16);
    border-color: rgba(14, 165, 233, 0.42);
    color: #075985;
    font-size: 0.95rem;
    letter-spacing: 0;
  }

  :global([data-theme='dark']) .theme-toggle-button.is-auto {
    background: rgba(14, 165, 233, 0.22);
    border-color: rgba(125, 211, 252, 0.46);
    color: #bae6fd;
  }

  .icon-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :global([data-theme='dark']) .icon-button {
    background: rgba(15, 23, 42, 0.7);
    border-color: rgba(148, 163, 184, 0.32);
    color: #e5eefb;
  }

  :global([data-theme='dark']) .icon-button:hover:not(:disabled) {
    background: rgba(15, 23, 42, 0.85);
  }

  :global([data-theme='dark']) .back-to-top-button {
    color: #7dd3fc;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  }

  @media (max-width: 799px) {
    .floating-actions {
      top: 1rem;
      right: 1rem;
    }

    .floating-actions.below-top-navigation {
      /* 移动端顶部导航 top:8px、高 48px；按钮垂直居中对齐首行，不遮挡搜索框 */
      top: 0.85rem;
    }

    .icon-button {
      width: 2.2rem;
      height: 2.2rem;
      font-size: 1rem;
    }

    .back-to-top-button {
      right: max(1rem, env(safe-area-inset-right));
      bottom: max(1rem, env(safe-area-inset-bottom));
    }
  }
</style>
