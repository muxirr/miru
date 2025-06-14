<script lang='ts'>
  import { persisted } from 'svelte-persisted-store'
  import { toast } from 'svelte-sonner'

  import SettingCard from '$lib/components/SettingCard.svelte'
  import { Button } from '$lib/components/ui/button'
  import { SingleCombo } from '$lib/components/ui/combobox'
  import { Switch } from '$lib/components/ui/switch'
  import { client } from '$lib/modules/anilist'
  import native from '$lib/modules/native'
  import { settings, SUPPORTS } from '$lib/modules/settings'
  import { t } from '$lib/modules/i18n'

  const prefix = 'app.settings.app'


  const debugOpts = {
    '': 'None',
    '*': 'All',
    'torrent:*,webtorrent:*,simple-peer,bittorrent-protocol,bittorrent-dht,bittorrent-lsd,torrent-discovery,bittorrent-tracker:*,ut_metadata,nat-pmp,nat-api': 'Torrent',
    'ui:*': 'Interface'
  }
  const debug = persisted('debug', '')

  async function copyLogs () {
    const logs = await native.getLogs()
    navigator.clipboard.writeText(logs)
    toast.success($t(`${prefix}.copy_message`), {
      description: $t(`${prefix}.copy_description`),
      duration: 5000
    })
  }

  async function copyDevice () {
    const device = await native.getDeviceInfo() as object
    const info = {
      ...device,
      appInfo: {
        userAgent: await navigator.userAgentData.getHighEntropyValues(['architecture', 'platform', 'platformVersion']),
        support: SUPPORTS,
        settings: $settings
      }
    }
    navigator.clipboard.writeText(JSON.stringify(info, null, 2))
    toast.success($t(`${prefix}.copy_message`), {
      description:  $t(`${prefix}.copy_description`),
      duration: 5000
    })
  }

  async function importSettings () {
    try {
      const imported = JSON.parse(await navigator.clipboard.readText())
      $settings = imported
      native.restart()
    } catch (err) {
      toast.error($t(`${prefix}.import_message`), {
        description: $t(`${prefix}.import_description`),
        duration: 5000
      })
    }
  }
  function exportSettings () {
    navigator.clipboard.writeText(JSON.stringify($settings))
    toast($t(`${prefix}.copy_message`), {
      description: $t(`${prefix}.copy_description`),
      duration: 5000
    })
  }
  function reset () {
    localStorage.clear()
    client.storage.clear()
    native.restart()
  }
</script>

<div class='space-y-3 pb-10 lg:max-w-4xl'>
  <div class='font-weight-bold text-xl font-bold'>{$t(`${prefix}.title_debug`)}</div>
  <SettingCard title={$t(`${prefix}.log_level`)} description={$t(`${prefix}.log_level_description`)}>
    <SingleCombo bind:value={$debug} items={debugOpts} class='w-32 shrink-0 border-input border' />
  </SettingCard>

  <SettingCard title={$t(`${prefix}.app_device_info`)} description={$t(`${prefix}.app_device_info_description`)}>
    <Button on:click={copyDevice} class='btn btn-primary'>{$t(`${prefix}.copy_message`)}</Button>
  </SettingCard>

  {#if !SUPPORTS.isAndroid}
    <SettingCard title={$t(`${prefix}.log_output`)} description={$t(`${prefix}.log_output_description`)}>
      <Button on:click={copyLogs} class='btn btn-primary'>{$t(`${prefix}.copy_message`)}</Button>
    </SettingCard>

    <SettingCard title={$t(`${prefix}.open_ui_devtools`)} description={$t(`${prefix}.open_ui_devtools_description`)}>
      <Button on:click={native.openUIDevtools} class='btn btn-primary'>{$t(`${prefix}.devtools_message`)}</Button>
    </SettingCard>
  {/if}

  <div class='font-weight-bold text-xl font-bold'>{$t(`${prefix}.title_app`)}</div>
  {#if !SUPPORTS.isAndroid}
    <SettingCard let:id title={$t(`${prefix}.hide_to_tray`)} description={$t(`${prefix}.hide_to_tray_description`)}>
      <Switch {id} bind:checked={$settings.hideToTray} />
    </SettingCard>
  {/if}
  <div class='flex flex-wrap gap-2'>
    <Button on:click={importSettings}>
      {$t(`${prefix}.import_settings`)}
    </Button>
    <Button on:click={exportSettings}>
      {$t(`${prefix}.export_settings`)}
    </Button>
    <Button on:click={reset} variant='destructive'>
      {$t(`${prefix}.reset_all`)}
    </Button>
  </div>
</div>
