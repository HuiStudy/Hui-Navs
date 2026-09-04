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
    title={bookmarksVisible ? '显示时间' : '显示书签'}
    aria-label={bookmarksVisible ? '显示时间' : '显示书签'}
  >
    {#if bookmarksVisible}
       <!-- 书签可见 → 显示日历图标（点击后隐藏书签） -->
    <svg class="toggle-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <path d="M235.050965 717.319797l-95.847408-55.12998L152.355995 622.338717a318.336256 318.336256 0 0 1-24.335948-23.627134l-42.765113 13.703738-61.824335-106.479619L57.453672 475.299185c-2.99277-9.765882-5.512998-19.689279-7.875711-29.612675l-47.254269-10.159668V313.138286l50.562068-10.710967c2.047685-8.348254 4.489156-16.538994 7.166897-24.57222l-40.481157-36.228272L81.080807 135.698508l55.12998 17.641594c4.725427-4.804184 9.608368-9.450854 14.72758-14.097524l-18.586679-56.941394 106.952161-61.11552 41.898785 45.994154c5.276727-1.575142 10.553453-2.914013 15.751423-4.174127l13.546224-63.005691h123.491155l13.546223 63.005691q6.930626 1.653899 13.94001 3.544071L506.369224 17.326565l95.768651 54.657437-15.751423 27.407476-73.716659-42.213813L471.322308 102.541763l-9.529611-2.992771a299.277034 299.277034 0 0 0-30.55776-7.875711l-10.159668-2.047685L408.552888 31.66036h-72.456545l-12.522382 58.043993-10.159667 2.047685a287.542224 287.542224 0 0 0-32.369174 8.348254l-9.608368 3.071528-38.433472-42.135056-63.005691 35.834487L187.481668 149.796031l-7.875711 6.851869a300.537148 300.537148 0 0 0-26.934934 25.753577l-7.009383 6.773112-49.853253-15.751423-36.070758 61.903091L96.832229 268.56176l-3.780341 10.08091A291.401323 291.401323 0 0 0 81.080807 319.04507l-2.126442 10.002154L33.826538 338.813106v70.881403l43.631441 9.214582 1.811414 10.553453a286.124596 286.124596 0 0 0 11.577296 45.206584l3.386556 9.923396L63.596727 512.078757l36.070759 61.824335 38.590986-12.28611 6.773111 7.875711a295.496693 295.496693 0 0 0 35.676973 35.204431l7.875712 6.851868-11.813568 36.070759 73.637902 41.977542z m45.206584-177.991078a193.427473 193.427473 0 0 1 96.004922-362.282726 196.105215 196.105215 0 0 1 178.463621 113.882787l-28.746347 12.994924A164.523612 164.523612 0 0 0 212.053888 370.315951a162.318413 162.318413 0 0 0 83.561298 141.762806z" fill="currentColor"/>
      <path d="M659.236783 1024c-199.649285 0-362.282726-160.822027-362.282726-358.581141s162.475927-358.581141 362.282726-358.581142 362.282726 160.900784 362.282725 358.581142-162.633441 358.581141-362.282725 358.581141z m0-685.659437c-182.32272 0-330.77988 146.724504-330.77988 327.078296S476.914063 992.497154 659.236783 992.497154s330.77988-146.724504 330.77988-327.078295-148.535918-327.078296-330.77988-327.078296zM713.815463 277.540071H604.500588a30.715275 30.715275 0 0 1-21.81572-9.057068 30.242732 30.242732 0 0 1-8.899554-21.57945v-70.251346a30.872789 30.872789 0 0 1 30.715274-30.715274h109.314875a30.636517 30.636517 0 0 1 30.794031 30.715274v70.251346a30.794032 30.794032 0 0 1-30.794031 30.636518zM605.288159 177.439778v68.833718h107.81849v-68.518689zM378.940213 393.943086l-24.887248-36.228273a24.887248 24.887248 0 0 1 6.694354-34.810644l56.311337-37.882172a25.281034 25.281034 0 0 1 34.731888 6.615597l24.808491 36.228273-25.989848 17.799108-21.264421-30.951546-45.521612 30.636517 21.028149 30.794032zM939.533352 393.943086l-25.989847-17.799108 21.106906-30.794032-45.600369-30.636517-21.264421 30.951546-25.989847-17.799108 24.887248-36.228273a25.123519 25.123519 0 0 1 34.65313-6.615597l56.311337 37.882172a24.887248 24.887248 0 0 1 6.694354 34.810644z" fill="currentColor"/>
      <path d="M824.075423 663.843716a164.523612 164.523612 0 0 0-164.83864-161.530841H656.007741l-0.787571-31.502846h4.016613a196.105215 196.105215 0 0 1 196.341486 192.718659zM640.728861 382.444547h31.502845v47.569297h-31.502845zM500.273423 429.58068l27.210583-15.869559 24.044547 41.22935-27.218459 15.869558zM402.409833 539.974527l15.656914-27.336594 41.623135 23.831902-15.656914 27.336595zM373.348458 652.345178h48.120597v31.502845h-48.120597zM405.166332 795.714629l41.638886-23.792525 15.633287 27.352346-41.646762 23.784649zM505.038229 904.037164l24.083925-41.205723 27.194832 15.893186-24.07605 41.205722zM646.163102 900.823873h31.502845v47.569297h-31.502845zM766.858379 875.920874l27.23421-15.83018 23.989417 41.252976-27.23421 15.838056zM858.649796 794.46239l15.649039-27.336594 41.623134 23.824027-15.649038 27.34447zM897.004511 646.989694h48.120596v31.502846h-48.120596zM856.003557 531.736533l41.662513-23.753146 15.60966 27.375973-41.670389 23.74527zM762.172331 452.357237l24.044547-41.229349 27.210583 15.877434-24.052423 41.221474z" fill="currentColor"/>
      <path d="M667.270008 630.427073l76.441655-77.142594 22.374897 22.170128-76.441656 77.150469z" fill="currentColor"/>
      <path d="M659.236783 713.69697a48.829411 48.829411 0 0 1-48.986925-48.59314A48.120597 48.120597 0 0 1 624.504895 630.686971a48.750654 48.750654 0 1 1 34.731888 83.009999z m0-65.683434a17.641594 17.641594 0 0 0-12.364867 5.040456 17.090294 17.090294 0 0 0-5.040456 12.049838 17.326565 17.326565 0 0 0 17.48408 17.090294 17.090294 17.090294 0 1 0 0-34.180588zM643.48536 259.898477h31.502845v51.743424h-31.502845z" fill="currentColor"/>
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
