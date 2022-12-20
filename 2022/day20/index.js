import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

function mixNumbers(original, output) {
  for (const number of original) {
    const start = output.indexOf(number);
    output.splice(start, 1);
    let newStart = start + number.n;

    if (newStart === 0) {
      output.push(number);
      continue;
    }

    if (newStart < 1) newStart = (newStart % (original.length - 1)) + original.length - 1;
    if (newStart > original.length - 1) newStart = newStart % (original.length - 1);
    output.splice(newStart, 0, number);
  }
}

const task1 = () => {
  const original = lines.toNumber().map((n) => ({ n }));
  const output = original.slice();
  mixNumbers(original, output);

  const a = output[(1000 + output.indexOf(output.find((n) => n.n === 0))) % output.length].n;
  const b = output[(2000 + output.indexOf(output.find((n) => n.n === 0))) % output.length].n;
  const c = output[(3000 + output.indexOf(output.find((n) => n.n === 0))) % output.length].n;

  console.log(a + b + c);
};

const task2 = () => {
  let numbers = lines.toNumber();
  const original = numbers.map((n) => ({
    a: n * 811589153,
    n: n * 811589153,
  }));
  const output = original.slice();
  for (let i = 0; i < 10; i++) {
    mixNumbers(original, output);
  }

  const a = output[(1000 + output.indexOf(output.find((n) => n.n === 0))) % output.length].a;
  const b = output[(2000 + output.indexOf(output.find((n) => n.n === 0))) % output.length].a;
  const c = output[(3000 + output.indexOf(output.find((n) => n.n === 0))) % output.length].a;

  console.log(a + b + c);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
