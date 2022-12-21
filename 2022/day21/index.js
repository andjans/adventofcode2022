import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const solve = (name, monkeys, prev = 0) => {
  const monkey = monkeys.find((m) => m[0] === name);
  if (["+", "-", "*", "/"].some((s) => monkey[1].includes(s))) {
    const parts = monkey[1].split(" ");
    const n1 = solve(parts[0], monkeys, prev);
    const n2 = solve(parts[2], monkeys, prev);
    switch (parts[1]) {
      case "+":
        return n1 + n2;
      case "*":
        return n1 * n2;
      case "-":
        return n1 - n2;
      case "/":
        return n1 / n2;
    }
  } else {
    // Number
    return prev + Number(monkey[1]);
  }
};

const solve2 = (name, monkeys) => {
  const monkey = monkeys.find((m) => m[0] === name);
  if (name === "root") {
    const parts = monkey[1].split(" ");
    const n1 = solve2(parts[0], monkeys);
    const n2 = solve2(parts[2], monkeys);
    return n1 + "=" + n2;
  } else if (["+", "-", "*", "/"].some((s) => monkey[1].includes(s))) {
    const parts = monkey[1].split(" ");
    const n1 = solve2(parts[0], monkeys);
    const n2 = solve2(parts[2], monkeys);

    switch (parts[1]) {
      case "+":
        if (Number.isInteger(n1) && Number.isInteger(n2)) return n1 + n2;
        else return "(" + n1 + "+" + n2 + ")";
      case "*":
        if (Number.isInteger(n1) && Number.isInteger(n2)) return n1 * n2;
        else return "(" + n1 + "*" + n2 + ")";
      case "-":
        if (Number.isInteger(n1) && Number.isInteger(n2)) return n1 - n2;
        else return "(" + n1 + "-" + n2 + ")";
      case "/":
        if (Number.isInteger(n1) && Number.isInteger(n2)) return n1 / n2;
        else return "(" + n1 + "/" + n2 + ")";
    }
  } else {
    // Number
    if (name === "humn") {
      return "x";
    }

    return Number(monkey[1]);
  }
};

const task1 = () => {
  const monkeys = lines.splitEachElementBy(": ");
  console.log(solve("root", monkeys));
};

const task2 = () => {
  const monkeys = lines.splitEachElementBy(": ");
  console.log("Paste the following into a equation solver:");
  console.log(solve2("root", monkeys));
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
