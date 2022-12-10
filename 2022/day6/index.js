import data from "./input.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");

const task1 = () => {
  const line = lines[0];
  const index = line.split("").findIndex((current, index, arr) => {
    const nextFour = arr.slice(index, index + 4);
    return nextFour.every((char) => nextFour.count(char) === 1);
  });
  console.log(index + 4);
};

const task2 = () => {
  const line = lines[0];
  const index = line.split("").findIndex((current, index, arr) => {
    const next = arr.slice(index, index + 14);
    return !!next.every((char) => next.count(char) === 1);
  });
  console.log(index + 14);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
