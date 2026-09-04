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
      <svg t="1788519968623" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8264" width="48" height="48">
        <path d="M506.838955 950.072267c-224.547149 0-407.230841-182.681646-407.230841-407.212422 0-224.532823 182.683692-407.216515 407.230841-407.216515 224.534869 0 407.218562 182.683692 407.218562 407.216515C914.057517 767.389598 731.373825 950.072267 506.838955 950.072267zM506.838955 190.254112c-194.428178 0-352.62006 158.177556-352.62006 352.605733 0 194.424084 158.191882 352.602663 352.62006 352.602663 194.430224 0 352.60778-158.178579 352.60778-352.602663C859.446735 348.431667 701.269179 190.254112 506.838955 190.254112z" fill="#272636" p-id="8265"></path><path d="M362.313328 811.974026c-2.279926 0-4.599761-0.559748-6.719028-1.76111C259.452635 755.683998 199.735555 653.229558 199.735555 542.859845c0-7.544837 6.106068-13.650905 13.652951-13.650905 7.54586 0 13.651928 6.106068 13.651928 13.650905 0 100.556207 54.42454 193.890942 142.019551 243.594971 6.559393 3.705392 8.865925 12.051477 5.146207 18.611893C371.686812 809.493531 367.073748 811.974026 362.313328 811.974026z" fill="#272636" p-id="8266"></path><path d="M480.094848 848.771093c-0.413416 0-0.813528-0.025583-1.240247-0.052189-5.906523-0.533143-11.746532-1.226944-17.532305-2.106987-7.466042-1.121544-12.598946-8.054443-11.492752-15.519462 1.119497-7.440459 8.052396-12.505825 15.519462-11.491729 5.28026 0.799202 10.586103 1.438769 15.959483 1.918699 7.505951 0.667196 13.038968 7.30743 12.372795 14.82566C493.040694 843.438645 487.080959 848.771093 480.094848 848.771093z" fill="#272636" p-id="8267"></path><path d="M172.683433 359.111914c-5.039783 0-10.146081-1.38658-14.705933-4.306072-45.358047-29.064966-72.436776-78.541821-72.436776-132.380006 0-86.648452 70.502727-157.137877 157.152203-157.137877 63.302745 0 120.126938 37.664831 144.778384 95.941096 5.879917 13.892405-0.613984 29.918403-14.506389 35.785018-13.932314 5.866614-29.918403-0.626263-35.785018-14.505365-16.092513-38.038338-53.184293-62.609966-94.488001-62.609966-56.543807 0-102.541421 45.997614-102.541421 102.527095 0 35.132148 17.678638 67.423599 47.291073 86.382393 12.692067 8.133238 16.398482 25.024953 8.266267 37.731346C190.496124 354.671789 181.683411 359.111914 172.683433 359.111914z" fill="#272636" p-id="8268"></path><path d="M851.314521 359.111914c-8.999978 0-17.811668-4.440126-23.025413-12.573363-8.133238-12.706393-4.425799-29.598108 8.266267-37.731346 29.612435-18.958794 47.291073-51.250244 47.291073-86.382393 0-56.530504-45.997614-102.527095-102.541421-102.527095-41.304731 0-78.395488 24.571628-94.488001 62.609966-5.866614 13.879102-21.87931 20.385283-35.785018 14.505365-13.892405-5.866614-20.386306-21.892613-14.506389-35.785018 24.65247-58.277288 81.47564-95.941096 144.778384-95.941096 86.648452 0 157.15118 70.489424 157.15118 157.137877 0 53.837162-27.078729 103.314017-72.435753 132.380006C861.460602 357.725334 856.355327 359.111914 851.314521 359.111914z" fill="#272636" p-id="8269"></path><path d="M219.04125 958.712041c-5.773494 0-11.599176-1.840928-16.545838-5.626137-11.985986-9.146311-14.279215-26.291806-5.119601-38.264489l59.810201-78.262458c9.146311-12.000312 26.2652-14.320147 38.264489-5.120624 11.985986 9.146311 14.279215 26.291806 5.119601 38.264489l-59.810201 78.262458C235.387543 955.004603 227.267609 958.712041 219.04125 958.712041z" fill="#272636" p-id="8270"></path><path d="M785.517979 958.712041c-8.225335 0-16.346293-3.707438-21.718651-10.746762l-59.810201-78.262458c-9.159614-11.971659-6.866385-29.118178 5.119601-38.264489 11.985986-9.199523 29.104875-6.879688 38.264489 5.120624l59.811224 78.262458c9.15859 11.971659 6.865361 29.118178-5.120624 38.264489C797.117155 956.871113 791.291472 958.712041 785.517979 958.712041z" fill="#272636" p-id="8271"></path><path d="M584.328817 655.387711c-7.040347 0-14.066367-2.706645-19.413142-8.106632l-73.649394-78.634942c-5.066389-5.106298-3.77293-12.013615-3.77293-19.199271L487.493352 333.539492c0-15.07944 12.226462-27.304879 27.305903-27.304879s27.305903 12.225439 27.305903 27.304879l0 204.681706 65.768913 70.662363c10.586103 10.721179 8.439206 28.013007-2.279926 38.611389C600.260671 652.761907 591.261717 655.387711 584.328817 655.387711z" fill="#272636" p-id="8272"></path></svg>
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
