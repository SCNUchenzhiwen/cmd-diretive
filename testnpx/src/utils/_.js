function getLetterTable() {
  const arr = []
  for(let i = 65; i < 91; i ++) {
    arr.push(String.fromCharCode(i))
  }
  return arr
}

exports.resolveAxios = (axiosLength = 26) => {
  const letterTable = getLetterTable()
  letterTable.unshift("")
  axiosLength < 1 && (axiosLength = 1)
  const firstLetter = letterTable[parseInt((axiosLength - 1) / 26)]
  const secondLetter = letterTable[axiosLength === 26 ? 26 : axiosLength % 26]
  return [firstLetter, secondLetter].join("")
}
