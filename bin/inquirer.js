const inquirer = require('inquirer')
const { questions } = require('../config')

module.exports = () => {
  return inquirer.prompt(questions)
}
