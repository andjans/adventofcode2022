import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const task1 = () => {
  const product = lines
    .toNumber()
    .combine(2)
    .find(([a, b]) => a + b === 2020)
    .product();
  console.log(product);
};

const task2 = () => {
  const product = lines
    .toNumber()
    .combine(3)
    .find(([a, b, c]) => a + b + c === 2020)
    .product();
  console.log(product);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
