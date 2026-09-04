<script lang="ts">
  import { onMount } from 'svelte'
  import { Solar } from 'lunar-javascript'

  interface HitokotoResponse {
    id: number
    hitokoto: string
    type: string
    from: string
    from_who: string | null
    creator: string
    created_at: string
    length: number
  }

  const HITOKOTO_URL = 'https://v1.hitokoto.cn/?c=d&c=e&c=h&c=i&c=k'

  let hour = '00'
  let minute = '00'
  let second = '00'
  let dateLine1 = ''
  let weekday = ''
  let lunar = ''

  let quote = ''
  let from = ''
  let fromWho: string | null = null
  let loading = true
  let error = ''
  let copied = false
  let timeTimer: ReturnType<typeof setInterval> | null = null

  function pad(n: number): string {
    return n < 10 ? `0${n}` : String(n)
  }

  function tick() {
    const now = new Date()
    hour = pad(now.getHours())
    minute = pad(now.getMinutes())
    second = pad(now.getSeconds())
    dateLine1 = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    weekday = weekdays[now.getDay()]
    try {
      const l = Solar.fromDate(now).getLunar()
      lunar = `${l.getMonthInChinese()}月${l.getDayInChinese()}`
    } catch {
      lunar = ''
    }
  }

  async function fetchHitokoto() {
    loading = true
    error = ''
    try {
      let res: Response
      try {
        res = await fetch(HITOKOTO_URL, { method: 'POST' })
      } catch {
        res = await fetch(HITOKOTO_URL, { method: 'GET' })
      }
      if (!res.ok) {
        res = await fetch(HITOKOTO_URL, { method: 'GET' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
      }
      const data: HitokotoResponse = await res.json()
      quote = data.hitokoto || ''
      from = data.from || ''
      fromWho = data.from_who ?? null
    } catch (err) {
      error = err instanceof Error ? err.message : '加载失败'
    } finally {
      loading = false
    }
  }

  async function handleCopy() {
    if (!quote) return
    const authorPart = fromWho ? fromWho : '佚名'
    const sourcePart = from ? `《${from}》` : ''
    const fullText = sourcePart
      ? `「${quote}」${sourcePart} ${authorPart}`
      : `「${quote}」 ${authorPart}`
    try {
      await navigator.clipboard.writeText(fullText)
      copied = true
      setTimeout(() => { copied = false }, 1500)
    } catch {
      // ignore
    }
  }

  function handleRefresh() {
    void fetchHitokoto()
  }

  onMount(() => {
    tick()
    void fetchHitokoto()
    timeTimer = setInterval(tick, 1000)
    return () => {
      if (timeTimer) clearInterval(timeTimer)
    }
  })
</script>

<section class="hitokoto-page">
  <div class="hitokoto-time-wrap">
    <div class="icon-box">
      <p class="seg seg-h">{hour}</p>
      <span class="colon">:</span>
      <p class="seg seg-m">{minute}</p>
      <span class="colon">:</span>
      <p class="seg seg-s">{second}</p>
    </div>
    <div class="date-line">
      <span>{dateLine1}</span>
      <span class="date-sep">&nbsp;&nbsp;</span>
      {#if lunar}
        <span>{lunar}</span>
        <span class="date-sep">&nbsp;&nbsp;</span>
      {/if}
      <span>{weekday}</span>
    </div>
  </div>

  <div class="hitokoto-quote-wrap">
    {#if loading}
      <div class="hitokoto-loading">加载中…</div>
    {:else if error}
      <button type="button" class="hitokoto-error-btn" on:click={handleRefresh} title={error}>
        加载失败，点击重试
      </button>
    {:else}
      <div class="words-line">
        <svg class="q-mark q-left" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M12 3 L12 12 L14 12 L14 18 L16 18 L18 11 L18 3 L12 3 Z M2 3 L2 12 L4 12 L4 18 L6 18 L8 11 L8 3 L2 3 Z" fill="currentColor"/>
        </svg>
        <p class="quote-text">{quote}</p>
        <svg class="q-mark q-right" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M12 3 L12 12 L14 12 L14 18 L16 18 L18 11 L18 3 L12 3 Z M2 3 L2 12 L4 12 L4 18 L6 18 L8 11 L8 3 L2 3 Z" fill="currentColor"/>
        </svg>
        <div class="hitokoto-actions">
          <button
            type="button"
            class="copy-btn"
            on:click={handleCopy}
            title="复制"
            aria-label="复制一言"
          >
            {#if copied}
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M13 5 7 11 4 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {:else}
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="5" y="5" width="9" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
                <path d="M3 10V2a1.5 1.5 0 0 1 1.5-1.5h6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            {/if}
          </button>
          <button
            type="button"
            class="refresh-btn"
            on:click={handleRefresh}
            title="换一句"
            aria-label="换一句"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 3v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 21v-5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="hitokoto-meta">
        {#if from}
          <div class="hitokoto-from">《{from}》</div>
        {/if}
        <div class="hitokoto-author">
          <span class="author-line"></span>
          <span class="author-name">{fromWho ?? '佚名'}</span>
          <span class="author-line"></span>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  /* ===== 容器 ===== */
  .hitokoto-page {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: clamp(0.75rem, 2vw, 1.5rem) clamp(0.5rem, 2vw, 1rem);
    box-sizing: border-box;
  }

  /* ===== 时间区域 ===== */
  .hitokoto-time-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(0.4rem, 1vw, 0.9rem);
  }

  .icon-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: rgba(245, 245, 250, 0.8);
    font-weight: 600;
    font-family: ui-monospace, 'SF Mono', 'Menlo', 'Consolas', monospace;
    line-height: 1;
  }

  .seg {
    margin: 0;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
    font-size: clamp(2.5rem, 12vw, 8.125rem);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .seg-h { text-align: right; }
  .seg-m { text-align: center; }
  .seg-s {
    text-align: left;
    width: clamp(4.5rem, 16vw, 10.625rem);
  }

  .colon {
    font-size: clamp(2.2rem, 10vw, 6.25rem);
    line-height: 1;
    font-weight: 400;
    flex-shrink: 0;
    margin: 0 0.05em;
    opacity: 0.7;
  }

  .date-line {
    font-size: clamp(0.875rem, 1.6vw, 1.25rem);
    line-height: 1.3;
    color: rgba(245, 245, 250, 0.8);
    letter-spacing: 0.04em;
    font-weight: 400;
  }

  .date-sep { white-space: pre; }

  /* ===== 诗词区域 ===== */
  .hitokoto-quote-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: auto;
    width: 100%;
    max-width: 52rem;
  }

  .words-line {
    position: relative;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.2em;
    width: max-content;
    max-width: 100%;
    font-size: clamp(0.875rem, 1.3vw, 1rem);
    line-height: 1.4;
    letter-spacing: 0.06em;
    font-weight: 500;
    color: rgba(245, 245, 250, 0.8);
    margin-top: clamp(-0.5rem, -2vw, -1.5rem);
  }

  .q-mark {
    width: 1.25em;
    height: 1.25em;
    flex-shrink: 0;
    opacity: 0.6;
  }

  .q-mark.q-right {
    transform: rotate(180deg);
  }

  .quote-text {
    flex: 0 1 auto;
    margin: 0;
    text-align: center;
    max-height: clamp(7rem, 14vh, 10rem);
    overflow-y: auto;
    scrollbar-width: none;
  }

  .quote-text::-webkit-scrollbar { display: none; }

  .hitokoto-actions {
    position: absolute;
    right: -5.3rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.375rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }

  .words-line:hover .hitokoto-actions {
    opacity: 1;
    pointer-events: auto;
  }

  .copy-btn,
  .refresh-btn {
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-btn {
    width: clamp(2.2rem, 3.6vw, 2.75rem);
    height: clamp(1.8rem, 2.8vw, 2.25rem);
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    color: rgba(245, 245, 250, 0.9);
  }

  .copy-btn:hover { background: rgba(255, 255, 255, 0.4); }
  .copy-btn svg { width: 1rem; height: 1rem; }

  .refresh-btn {
    width: clamp(1.8rem, 2.8vw, 2.25rem);
    height: clamp(1.8rem, 2.8vw, 2.25rem);
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    color: rgba(245, 245, 250, 0.9);
  }

  .refresh-btn:hover { background: rgba(255, 255, 255, 0.4); }
  .refresh-btn svg { width: 1.125rem; height: 1.125rem; }

  .hitokoto-meta {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: clamp(0.875rem, 1.3vw, 1rem);
    line-height: 1;
    letter-spacing: 0.06em;
    color: #fff;
    opacity: 0.6;
    margin-top: clamp(0.6rem, 1.5vh, 1rem);
  }

  .hitokoto-from {
    padding-bottom: clamp(0.6rem, 1.5vh, 1rem);
    padding-top: clamp(0.3rem, 0.7vh, 0.5rem);
  }

  .hitokoto-author {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .author-line {
    display: inline-block;
    width: clamp(1.5rem, 3vw, 2.5rem);
    height: 1px;
    background: #fff;
  }

  .author-line:first-child { margin-right: 0.25rem; }
  .author-line:last-child  { margin-left: 0.25rem; }

  .author-name { padding: 0 0.125rem; }

  .hitokoto-loading,
  .hitokoto-error-btn {
    padding: 0.4rem 0;
    opacity: 0.6;
    font-size: 0.9rem;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-family: inherit;
    text-align: center;
  }

  .hitokoto-error-btn:hover {
    opacity: 0.9;
    text-decoration: underline;
  }

  /* ===== 书签隐藏模式：时间贴顶+诗词贴底 ===== */
  :global(.bookmarks-hidden) .hitokoto-page {
    min-height: calc(100dvh - clamp(10rem, 25vh, 15rem));
    justify-content: space-between;
    padding-top: clamp(6rem, 12vh, 12vh);
    padding-bottom: clamp(6rem, 10vh, 10vh);
  }

  :global(.bookmarks-hidden) .hitokoto-quote-wrap {
    margin-top: 0;
  }

  /* ===== 深色主题微调 ===== */
  :global([data-theme='dark']) .hitokoto-page {
    color: rgba(245, 245, 250, 0.9);
  }

  /* ===== 断点微调（仅保留字体权重降级等非尺寸类） ===== */
  @media (max-width: 480px) {
    .icon-box { font-weight: 500; }
  }
</style>
