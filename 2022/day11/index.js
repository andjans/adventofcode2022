import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const div3 = (v) => v / 3;

const divDb = (v, mod) => v % mod;

function round(monkeys, monkeyItems, adjustWorryLevel, mod) {
  monkeys.forEach((monkey, index) => {
    const operationSplit = monkey[2].trim().split(" ");
    const secondNumber = operationSplit[5];
    const operation =
      operationSplit[4] === "+"
        ? (firstNumber) =>
            firstNumber + (secondNumber === "old" ? firstNumber : Number(secondNumber))
        : (firstNumber) =>
            firstNumber * (secondNumber === "old" ? firstNumber : Number(secondNumber));

    const divisor = monkey[3].trim().split(" ")[3];
    const [y, n] = [Number(monkey[4].trim().split(" ")[5]), Number(monkey[5].trim().split(" ")[5])];
    monkeyItems[index].slice().forEach((monkeyItem) => {
      let worryLevel = operation(monkeyItem);
      worryLevel = Math.floor(adjustWorryLevel(worryLevel, mod));
      const isDividable = worryLevel % divisor === 0;
      monkeyItems[isDividable ? y : n].push(worryLevel);
      monkeyItems[index].splice(0, 1);
      monkey[6] = (monkey[6] || 0) + 1;
    });
  });
}

const task1 = () => {
  const monkeys = lines.splitByElement("");
  const monkeyItems = monkeys.map((m) => m[1].split(": ")[1].split(", ").toNumber());

  for (let i = 0; i < 20; i++) {
    round(monkeys, monkeyItems, div3);
  }
  const s = monkeys.map((m) => m[6]).sort((a, b) => b - a);
  console.log(s);
};

const task2 = () => {
  const monkeys = lines.splitByElement("");
  const monkeyItems = monkeys.map((m) => m[1].split(": ")[1].split(", ").toNumber());
  const mod = monkeys.map((m) => Number(m[3].trim().split(" ")[3])).product();
  for (let i = 0; i < 10000; i++) {
    round(monkeys, monkeyItems, divDb, mod);
  }
  const s = monkeys.map((m) => m[6]).sort((a, b) => b - a);
  console.log(s);
  console.log(s[0] * s[1]);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
