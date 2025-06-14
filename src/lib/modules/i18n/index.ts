
import { init, locale, waitLocale, register, _ } from 'svelte-i18n'

register('zh-cn', () => import('./locales/zh-cn.json'))
register('en-us', () => import('./locales/en-us.json'))

init({
  fallbackLocale: 'en-us',
  initialLocale: 'en-us',
})

export function switchLocale(lang: string) {
  locale.set(lang)
}

export { locale, waitLocale, _ as t }
