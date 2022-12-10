import data from './input.js'
import '../../helpers/helpers.js'

const lowercaseLetters = [...Array(26)].map((e, i) => String.fromCharCode(i + 97))
const uppercaseLetters = [...Array(26)].map((e, i) => String.fromCharCode(i + 65))
const PRIO_VALUES = [" ", ...lowercaseLetters, ...uppercaseLetters]

const task1 = () => {
  const lines = data.split("\n")
  const prios = lines.map(line => {
    const secondPart = line.slice(line.length / 2, line.length)
    const duplicate = Array.from(line).find(char => secondPart.includes(char))
    return PRIO_VALUES.indexOf(duplicate)
  })
  console.log(prios.reduce((sum, curr) => sum + curr))
}

const task2 = () => {
  const lines = data.split("\n")
  let sum = 0
  for (let i = 0; i < lines.length; i += 3) {
    const prio = PRIO_VALUES.find(char => {
      return lines[i].includes(char) && lines[i+1].includes(char) && lines[i+2].includes(char)
    })
    sum += PRIO_VALUES.indexOf(prio)
  }
  console.log(sum)
}


console.log('---- task 1 ----')
task1()
console.log('----------------')
console.log('')
console.log('---- task 2 ----')
task2()
console.log('----------------')
console.log('')
