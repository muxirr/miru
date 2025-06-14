<script lang='ts'>
  import CloudOff from 'lucide-svelte/icons/cloud-off'
  import Folder from 'lucide-svelte/icons/folder'
  import MessagesSquare from 'lucide-svelte/icons/messages-square'

  import Anilist from '$lib/components/icons/Anilist.svelte'
  import Kitsu from '$lib/components/icons/Kitsu.svelte'
  import * as Avatar from '$lib/components/ui/avatar'
  import { Button } from '$lib/components/ui/button'
  import * as Dialog from '$lib/components/ui/dialog'
  import Input from '$lib/components/ui/input/input.svelte'
  import { Label } from '$lib/components/ui/label'
  import { Switch } from '$lib/components/ui/switch'
  import * as Tooltip from '$lib/components/ui/tooltip'
  import { client } from '$lib/modules/anilist'
  import { authAggregator } from '$lib/modules/auth'
  import ksclient from '$lib/modules/auth/kitsu'
  import native from '$lib/modules/native'
  import { click } from '$lib/modules/navigate'
  import { t } from '$lib/modules/i18n'

  const prefix = 'app.settings.accounts'
  const alviewer = client.viewer

  $: anilist = $alviewer

  const kitsuviewer = ksclient.viewer

  $: kitsu = $kitsuviewer

  const syncSettings = authAggregator.syncSettings

  let kitsuLogin = ''
  let kitsuPassword = ''
</script>

<div class='space-y-3 pb-10 lg:max-w-4xl'>
  <div class='font-weight-bold text-xl font-bold'>{$t(`${prefix}.title`)}</div>

  <div>
    <div class='bg-neutral-900 px-6 py-4 rounded-t-md flex flex-row gap-3'>
      {#if anilist?.viewer?.id}
        <div use:click={() => native.openURL(`https://anilist.co/user/${anilist.viewer?.name}`)} class='flex flex-row gap-3'>
          <Avatar.Root class='size-8 rounded-md'>
            <Avatar.Image src={anilist.viewer.avatar?.large ?? ''} alt={anilist.viewer.name} />
            <Avatar.Fallback>{anilist.viewer.name}</Avatar.Fallback>
          </Avatar.Root>
          <div class='flex flex-col'>
            <div class='text-sm'>
              {anilist.viewer.name}
            </div>
            <div class='text-[9px] text-muted-foreground leading-snug'>
              {$t(`${prefix}.aniList`)}
            </div>
          </div>
        </div>
      {:else}
        <div>{$t(`${prefix}.not_logged_in`)}</div>
      {/if}
      <Anilist class='size-6 ml-auto' />
    </div>

    <div class='bg-neutral-950 px-6 py-4 rounded-b-md flex justify-between'>
      {#if anilist?.viewer?.id}
        <Button variant='secondary' on:click={() => client.logout()}>{$t(`${prefix}.logout`)}</Button>
      {:else}
        <Button variant='secondary' on:click={() => client.auth()}>{$t(`${prefix}.login`)}</Button>
      {/if}
      <div class='flex items-center gap-4'>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <MessagesSquare size={16} class='text-muted-foreground' />
          </Tooltip.Trigger>
          <Tooltip.Content>
            {$t(`${prefix}.has_discussions`)}
          </Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <CloudOff size={16} class='text-muted-foreground' />
          </Tooltip.Trigger>
          <Tooltip.Content>
            {$t(`${prefix}.works_offline`)}
          </Tooltip.Content>
        </Tooltip.Root>
        <div class='flex gap-2 items-center'>
          <Switch hideState={true} id='al-sync-switch' bind:checked={$syncSettings.al} />
          <Label for='al-sync-switch' class='cursor-pointer'>{$t(`${prefix}.enable_sync`)}</Label>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class='bg-neutral-900 px-6 py-4 rounded-t-md flex flex-row gap-3'>
      {#if kitsu?.id}
        <div use:click={() => native.openURL(`https://kitsu.app/users/${kitsu.name}`)} class='flex flex-row gap-3'>
          <Avatar.Root class='size-8 rounded-md'>
            <Avatar.Image src={kitsu.avatar?.large ?? ''} alt={kitsu.name} />
            <Avatar.Fallback>{kitsu.name}</Avatar.Fallback>
          </Avatar.Root>
          <div class='flex flex-col'>
            <div class='text-sm'>
              {kitsu.name}
            </div>
            <div class='text-[9px] text-muted-foreground leading-snug'>
              {$t(`${prefix}.kitsu`)}
            </div>
          </div>
        </div>
      {:else}
        <div>{$t(`${prefix}.not_logged_in`)}</div>
      {/if}
      <Kitsu class='size-6 !ml-auto' />
    </div>

    <div class='bg-neutral-950 px-6 py-4 rounded-b-md flex justify-between'>
      {#if kitsu?.id}
        <Button variant='secondary' on:click={() => ksclient.logout()}>{$t(`${prefix}.logout`)}</Button>
      {:else}
        <Dialog.Root portal='#root'>
          <Dialog.Trigger let:builder asChild>
            <Button builders={[builder]} variant='secondary'>{$t(`${prefix}.kitsu_login_title`)}</Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header class='items-center'>
              <div class='space-y-4 px-4 sm:px-6 max-w-xl w-full'>
                <div class='font-weight-bold text-xl font-bold'>{$t(`${prefix}.kitsu_login_title`)}</div>
                <div class='space-y-2'>
                  <Label for='kitsu-login' class='leading-[unset] grow font-bold'>{$t(`${prefix}.kitsu_login_label`)}</Label>
                  <Input type='text' id='kitsu-login' placeholder='email@website.com' autocomplete='off' bind:value={kitsuLogin} />
                </div>
                <div class='space-y-2'>
                  <Label for='kitsu-password' class='leading-[unset] grow font-bold'>{$t(`${prefix}.kitsu_password_label`)}</Label>
                  <Input type='password' id='kitsu-password' placeholder='**************' autocomplete='off' bind:value={kitsuPassword} />
                </div>
                <div class='text-sm text-muted-foreground'>
                  {$t(`${prefix}.kitsu_password_info`)}
                </div>
                <div class='py-3 gap-3 mt-auto flex flex-col sm:flex-row-reverse'>
                  <Button variant='secondary' on:click={() => ksclient.login(kitsuLogin, kitsuPassword)}>{$t(`${prefix}.login`)}</Button>
                  <Dialog.Close let:builder asChild>
                    <Button variant='destructive' builders={[builder]}>{$t(`${prefix}.cancel`)}</Button>
                  </Dialog.Close>
                </div>
              </div>
            </Dialog.Header>
          </Dialog.Content>
        </Dialog.Root>
      {/if}
      <div class='flex gap-2 items-center'>
        <Switch hideState={true} id='kitsu-sync-switch' bind:checked={$syncSettings.kitsu} />
        <Label for='kitsu-sync-switch' class='cursor-pointer'>{$t(`${prefix}.enable_sync`)}</Label>
      </div>
    </div>
  </div>

  <div>
    <div class='bg-neutral-900 px-6 py-4 rounded-t-md flex flex-row gap-3'>
      <div class='flex flex-row gap-3'>
        <div class='flex flex-col'>
          <div class='text-sm'>
            {$t(`${prefix}.other`)}
          </div>
          <div class='text-[9px] text-muted-foreground leading-snug'>
            {$t(`${prefix}.local`)}
          </div>
        </div>
      </div>
      <Folder class='size-6 !ml-auto' fill='currentColor' />
    </div>
    <div class='bg-neutral-950 px-6 py-4 rounded-b-md flex justify-end h-[68px] gap-4'>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <CloudOff size={16} class='text-muted-foreground' />
        </Tooltip.Trigger>
        <Tooltip.Content>
          {$t(`${prefix}.works_offline`)}
        </Tooltip.Content>
      </Tooltip.Root>
      <div class='flex gap-2 items-center'>
        <Switch hideState={true} id='local-sync-switch' bind:checked={$syncSettings.local} />
        <Label for='local-sync-switch' class='cursor-pointer'>{$t(`${prefix}.enable_sync`)}</Label>
      </div>
    </div>
  </div>
</div>