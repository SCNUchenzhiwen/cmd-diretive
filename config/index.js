const fs = require('fs')

exports.questions = [{
  type: 'input',
  name: 'version',
  message: 'verson(1.0.0)：',
  default: '1.0.0',
  validate(val) {
    return true;
  }
}]

exports.repository = {
  admin: `https://codeload.github.com/SCNUchenzhiwen/node-excel/zip/master?token=AGF24BCIPOTQQSEDFFZ5F527YC6GQ`,
  h5: `https://codeload.github.com/SCNUchenzhiwen/node-excel/zip/master?token=AGF24BCIPOTQQSEDFFZ5F527YC6GQ`
}

exports.cookie = ``