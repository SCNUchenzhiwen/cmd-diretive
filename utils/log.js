const colors = require('colors')
const emoji = require('node-emoji')

const LOG_PREFIX = ``

const resolveMsg = (msg) => {
  const resolveWmoji = () => {
    const reg = /:[a-z]:/g
    return msg.replace(reg, (p1) => emoji.get(p1))
  }
  return `${LOG_PREFIX}${resolveWmoji(msg)}`
}

const logInfo = (msg) => {
  if (typeof msg === 'string') {
    console.log(emoji.emojify(colors.green(resolveMsg(msg))))
  }
}

const logWarn = (msg) => {
  if (typeof msg === 'string') {
    console.log(emoji.emojify(colors.yellow(resolveMsg(msg))))
  }
}

const logError = (msg) => {
  if (typeof msg === 'string') {
    console.log(emoji.emojify(colors.red(resolveMsg(msg))))
  }
}

const logDirective = (directive) => {
  if (typeof directive === 'string') {
    console.log(`\n ${colors.gray('$')} ${colors.yellow(directive)}\n`)
  }
}

module.exports = {
  info: logInfo,
  warn: logWarn,
  error: logError,
  directive: logDirective
}
