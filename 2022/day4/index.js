import data from './input.js'

const task1 = () => {
    const count = data.reduce((count, current) => {
        const section0 = getSections(current[0])
        const section1 = getSections(current[1])
        return section0.every(r=> section1.includes(r)) || section1.every(r=> section0.includes(r)) ? count + 1 : count
    }, 0)
    console.log(count)
}

const task2 = () => {
    const count = data.reduce((count, current) => {
        const section0 = getSections(current[0])
        const section1 = getSections(current[1])
        return section0.some(r=> section1.includes(r)) || section1.some(r=> section0.includes(r)) ? count + 1 : count
    }, 0)
    console.log(count)
}



const getSections = (range) => {
    const minMax = range.split('-')
    const min = Number(minMax[0])
    const max = Number(minMax[1])
    const sections = []
    for (let i = min; i <= max ; i++) {
        sections.push(i)
    }
    return sections
}

console.log('---- task 1 ----')
task1()
console.log('----------------')
console.log('')
console.log('---- task 2 ----')
task2()
console.log('----------------')
console.log('')
