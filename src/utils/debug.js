import log from '@samislam/log'

const mode = 'production'

export default function debug(...logs) {
  if (mode !== 'dev') return
  log(...logs)
}
