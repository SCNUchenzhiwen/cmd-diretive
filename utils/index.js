const fs = require('fs')
const log = require('./log')
const shell = require("shelljs")

exports.editPackageFile = ({
  version,
  projectName
}) => {
  const path = `${process.cwd()}/${projectName}/package.json`
  try {
    const data = fs.readFileSync(path)
    const _data = JSON.parse(data)
    _data.name = projectName
    _data.version = version
    const packageStr = JSON.stringify(_data, null, 2)
    fs.writeFileSync(path, packageStr)
  } catch (err) {
    throw err
  }
}

exports.logSuccess = ({
  projectName
}) => {
  const directive = `cd ${projectName}`
  log.directive(directive)
}

exports.checkProjectName = (projectName) => {
  let result = !!projectName
  const checkExistProject = (projectName) => {
    if (fs.existsSync(projectName)) {
      log.error(':bug: 项目已存在')
      return false
    }
    return true
  }
  if (!result) {
    log.error(`:rotating_light: 请输入合法的项目名，例如archer-report-admin`)
    return result
  }
  const reg = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*/
  result = reg.test(projectName)
  if (!result) {
    log.error(`:rotating_light: 请输入合法的项目名，例如archer-report-admin`)
  }
  result && (result = checkExistProject(projectName))
  return result
}

exports.installPraoject = (projectName) => {
  return new Promise((resolve, reject) => {
    shell.cd(`./${projectName}`)
    shell.exec(`npm install`, (code, stdout, stderr) => {
      console.log(stdout)
      if (code !== 0) {
        reject(`Error: install dependent fail`)
        shell.echo('Error: install dependent fail')
        shell.exit(1)
      } else {
        shell.exec('git init')
        resolve(true)
      }
    })
  })
}
