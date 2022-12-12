import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { Grid } from "../../helpers/Grid.js";
import { lowercaseLetters } from "../../helpers/stringUtils.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const checkIfPossible = (a, b) => {
  if (b.type === "E") return ["y", "z"].includes(a.type);
  return lowercaseLetters.indexOf(b.type) <= lowercaseLetters.indexOf(a.type) + 1;
};

const checkIfPossibleTask2 = (a, b) => {
  if (a.type === "E") return ["y", "z"].includes(b.type);
  return lowercaseLetters.indexOf(a.type) <= lowercaseLetters.indexOf(b.type) + 1;
};

const task1 = () => {
  const g = Grid.createFromArrayOfStrings(lines);
  const start = g.getAllWithType("S")[0];
  const end = g.getAllWithType("E")[0];
  const result = g.findClosestPath(start, [end], { checkIfPossible });
  console.log(result.cost);
};

const task2 = () => {
  const g = Grid.createFromArrayOfStrings(lines);
  const starts = g.getAllWithType("a");
  const end = g.getAllWithType("E")[0];
  const result = g.findClosestPath(end, starts, { checkIfPossible: checkIfPossibleTask2 });
  console.log(result.cost);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
