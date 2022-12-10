import data from "./input.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");

function transposeAndTrim(crates) {
  return crates
    .slice(0, crates.length - 1)
    .map((level) => level.everyNthChar(4, 1))
    .transposeStrings()
    .map((crate) => crate.trim());
}

const task1 = () => {
  let [crates, moves] = lines.splitByElement("");
  crates = transposeAndTrim(crates);

  moves.forEach((move) => {
    const [count, from, to] = move.split(" ").everyNthElement(2, 1);
    crates[to - 1] = crates[from - 1].substring(0, count).reverse() + crates[to - 1];
    crates[from - 1] = crates[from - 1].substring(count);
  });

  console.log(crates.transposeStrings()[0]);
};

const task2 = () => {
  let [crates, moves] = lines.splitByElement("");
  crates = transposeAndTrim(crates);

  moves.forEach((move) => {
    const [count, from, to] = move.split(" ").everyNthElement(2, 1);
    crates[to - 1] = crates[from - 1].substring(0, count) + crates[to - 1];
    crates[from - 1] = crates[from - 1].substring(count);
  });

  console.log(crates.transposeStrings()[0]);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
