import { isString, isObject } from '@intlify/shared'
import { getLocalesRegex } from '../utils'
import { localeCodes, nuxtI18nOptions } from '#build/i18n.options.mjs'

import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'

export function createLocaleFromRouteGetter() {
  const { routesNameSeparator, defaultLocaleRouteNameSuffix } = nuxtI18nOptions
  const localesPattern = `(${localeCodes.join('|')})`
  const defaultSuffixPattern = `(?:${routesNameSeparator}${defaultLocaleRouteNameSuffix})?`
  const regexpName = new RegExp(`${routesNameSeparator}${localesPattern}${defaultSuffixPattern}$`, 'i')
  const regexpPath = getLocalesRegex(localeCodes)

  /**
   * extract locale code from given route:
   * - if route has a name, try to extract locale from it
   * - otherwise, fall back to using the routes'path
   */
  const getLocaleFromRoute = (route: RouteLocationNormalizedLoaded | RouteLocationNormalized | string): string => {
    // extract from route name
    if (isObject(route)) {
      if (route.name) {
        const name = isString(route.name) ? route.name : route.name.toString()
        const matches = name.match(regexpName)
        if (matches && matches.length > 1) {
          return matches[1]
        }
      } else if (route.path) {
        // Extract from path
        const matches = route.path.match(regexpPath)
        if (matches && matches.length > 1) {
          return matches[1]
        }
      }
    } else if (isString(route)) {
      const matches = route.match(regexpPath)
      if (matches && matches.length > 1) {
        return matches[1]
      }
    }

    return ''
  }

  return getLocaleFromRoute
}
