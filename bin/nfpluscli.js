#!/usr/bin/env node
const inquirer = require('./inquirer')
const ora = require('ora');
const emoji = require('node-emoji')
const spinner = ora(emoji.emojify(':fire: fetching project template...'))
const download = require('download-git-repo')
const { editPackageFile, logSuccess, checkProjectName, installPraoject } = require('../utils/index')
const argv = require('yargs').argv
const log =require('../utils/log')
const { repository, cookie } = require('../config')

const downloadTmp = ({projectName, version, repositoryUrl }) => {
  download(`direct:${repositoryUrl}`, projectName, {
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cookie': cookie
    },
    rejectUnauthorized: false
  }, async (err) => {
    if (err) {
      spinner.stop()
      throw new Error(err)
    } else {
      editPackageFile({ projectName, version })
      spinner.succeed(emoji.emojify(`:tada: 模板创建成功`))
      spinner.start(`install dependence...`)
      await installPraoject(projectName)
      spinner.succeed(emoji.emojify(`:tada: 初始化项目完成...`))
      logSuccess({ projectName })
    }
  })
}

const init = async () => {
  const directive = argv._[0]
  const projectName = argv._[1]
  const key = directive ? `${directive.split('-').slice(-1)[0]}` : ''
  if (!directive || !repository[`${directive.split('-').slice(-1)[0]}`]) {
    log.warn(`\n:rotating_light: 请使用${Object.keys(repository).map(key => `create-nfplus-${key}`).join('或')}创建应用\n`)
    return
  }
  if (!projectName) {
    log.warn(':rotating_light: 请输入项目名称')
    return
  }
  const result = checkProjectName(projectName)
  if (!result) return
  const repositoryUrl = repository[key]
  const answer = await inquirer()
  spinner.start()
  spinner.color = 'green'
  downloadTmp({...answer, projectName, repositoryUrl})
}

init()
