<script lang="ts">
  import { version } from '$app/environment'
  import SettingsNav from '$lib/components/SettingsNav.svelte'
  import { Separator } from '$lib/components/ui/separator'
  import native from '$lib/modules/native'
  import { dragScroll } from '$lib/modules/navigate'
  import { t  } from '$lib/modules/i18n'

  const prefix = 'app.settings'
  const items = [
  {
    key: 'player',
    href: '/app/settings/'
  },
  {
    key: 'client',
    href: '/app/settings/client/'
  },
  {
    key: 'interface',
    href: '/app/settings/interface/'
  },
  {
    key: 'extensions',
    href: '/app/settings/extensions/'
  },
  {
    key: 'accounts',
    href: '/app/settings/accounts/'
  },
  {
    key: 'app',
    href: '/app/settings/app/'
  },
  {
    key: 'change_log',
    href: '/app/settings/changelog/'
  }
]
</script>

<div class="space-y-6 p-10 pb-0 w-full h-full flex flex-col">
  <div class="space-y-0.5">
    <h2 class="text-2xl font-bold">{ $t(`${prefix}.title`) }</h2>
    <p class="text-muted-foreground">{ $t(`${prefix}.description`) }</p>
  </div>
  <Separator class="my-6" />
  <div class="flex flex-col lg:flex-row gap-x-12 grow min-h-0">
    <aside class="lg:grow lg:max-w-60 flex flex-col">
      <SettingsNav items={items.map(item => ({
        ...item,
        title: $t(`${prefix}.nav.${item.key}`)
      }))} />
      <div class="mt-auto text-xs text-muted-foreground px-4 sm:px-2 py-5 flex flex-row lg:flex-col font-light gap-0.5 gap-x-4 flex-wrap">
        <div>{$t(`${prefix}.interface`)} v{version}</div>
        <div>{$t(`${prefix}.native`)} {#await native.version() then version}{version}{/await}</div>
        {#if 'userAgentData' in navigator}
          {#await navigator.userAgentData.getHighEntropyValues(['architecture', 'platform', 'platformVersion']) then { architecture, platform, platformVersion }}
            <div>{platform} {platformVersion} {architecture}</div>
          {:catch e}
            <div>{$t(`${prefix}.device_info`)}</div>
          {/await}
        {:else}
          <div>{$t(`${prefix}.device_info`)}</div>
        {/if}
      </div>
    </aside>
    <div class="flex-1 overflow-y-scroll pb-40" use:dragScroll>
      <slot />
    </div>
  </div>
</div>
