import data from './input.js'

const task1 = () => {
    console.log(getMostCalories())
}

const task2 = () => {
    console.log(getTop3Calories())
}

const getMostCalories = () => {
    return data.reduce((max, elf) => {
        const sum = elf.reduce((sum, cal) => (sum + cal), 0)
        return sum > max ? sum : max
    }, 0)
}

const getTop3Calories = () => {
    const elves = data.map((elf) => {
        return elf.reduce((sum, cal) => (sum + cal), 0)
    })
    const top3 =  elves.sort((a, b) => (a >= b ? -1 : 1)).slice(0, 3)
    console.log(top3)
    return top3.reduce((sum, cal) => (sum + cal), 0)
}

console.log('---- task 1 ----')
task1()
console.log('----------------')
console.log('')
console.log('---- task 2 ----')
task2()
console.log('----------------')
console.log('')
