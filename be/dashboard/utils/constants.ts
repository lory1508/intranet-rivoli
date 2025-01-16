// BACKEND
const BE_URL: string = "http://localhost"
const BE_PORT: string = "5050"
const BE_PATH: string = `${BE_URL}:${BE_PORT}/api`

// Customization
const LOGO_PATH: string = '/img/logo.png'

const MIN_LENGTH_NAME: number = 2
const MAX_LENGTH_NAME: number = 150
const MIN_LENGTH_5: number = 5
const MAX_LENGTH_180: number = 180
const MIN_LENGTH_USERNAME: number = 5
const MAX_LENGTH_USERNAME: number = 150
const MIN_INTERNO: number = 1
const MAX_INTERNO: number = 9999
const EMAIL_DOMAIN: string = '@comune.rivoli.to.it'
const UNCLICKABLE_MENU_ITEMS: string[] = ['organizzazione', 'contenuti']

export {
  BE_PATH,
  LOGO_PATH,
  MIN_LENGTH_NAME,
  MAX_LENGTH_NAME,
  MIN_LENGTH_USERNAME,
  MAX_LENGTH_USERNAME,
  MIN_INTERNO,
  MAX_INTERNO,
  EMAIL_DOMAIN,
  UNCLICKABLE_MENU_ITEMS,
  MIN_LENGTH_5,
  MAX_LENGTH_180
}