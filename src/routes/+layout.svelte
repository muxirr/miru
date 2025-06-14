<script lang='ts'>
  import '../app.css'
  import '@fontsource-variable/nunito'
  import '$lib/modules/navigate'
  import { ProgressBar } from '@prgm/sveltekit-progress-bar'

  import Backplate from '$lib/components/Backplate.svelte'
  import Online from '$lib/components/Online.svelte'
  import { Menubar } from '$lib/components/ui/menubar'
  import { Toaster } from '$lib/components/ui/sonner'
  import native from '$lib/modules/native'
  import { settings, SUPPORTS } from '$lib/modules/settings'
  import { locale } from '$lib/modules/i18n'
  import { onMount } from 'svelte'

  let root: HTMLDivElement

  let updateProgress = 0

  const availableLanguages = [
  { key: 'en-us', label: 'English' },
  { key: 'zh-cn', label: '简体中文' },
  ]

  onMount(() => {
    const saved = localStorage.getItem('user-lang')
    if (saved && availableLanguages.some(l => l.key === saved)) {
      locale.set(saved)
    } else {
      locale.set('en-us')
    }
  })

  function changeLanguage(event: Event) {
    const select = event.target as HTMLSelectElement
    locale.set(select.value)
    localStorage.setItem('user-lang', select.value)
  }

  native.updateProgress(progress => {
    updateProgress = progress
  })
</script>

<svelte:head>
  <meta name='viewport' content='width=device-width, initial-scale={SUPPORTS.isAndroid ? $settings.uiScale : 1}, user-scalable=0' />
</svelte:head>

<div class='w-full h-full flex flex-col backface-hidden bg-black relative overflow-clip border-l-2 [border-image:linear-gradient(to_bottom,white_var(--progress),#2dcf58_var(--progress))_1] preserve-3d' bind:this={root} id='root' style:--progress='{100 - updateProgress}%'>
  <ProgressBar zIndex={100} />
  <Toaster />
  <div class="absolute top-10 right-4 z-50">
    <select on:change={changeLanguage} bind:value={$locale} class="bg-neutral-800 text-white rounded px-2 py-1">
      {#each availableLanguages as lang}
        <option value={lang.key}>{lang.label}</option>
      {/each}
    </select>
  </div>
  <Menubar />
  <Online />
  <slot />
</div>
<Backplate {root} />
