import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const task1 = () => {
  const strengths = [];
  let registerX = 1;
  let currentOperation;
  const operations = [];
  let executionCycle = 1;
  for (let index = 0; index < 220; index++) {
    if (index < lines.length) operations.push(lines[index]);
    currentOperation = operations[0];

    if ([20, 60, 100, 140, 180, 220].includes(index + 1)) {
      console.log(index + 1, registerX);
      strengths.push(registerX * (index + 1));
    }

    if (currentOperation === "noop") {
      operations.shift();
    } else if (currentOperation) {
      if (executionCycle === 2) {
        registerX += Number(currentOperation.split(" ")[1]);
        operations.shift();
        executionCycle = 1;
      } else {
        executionCycle = 2;
      }
    }
  }
  console.log(strengths);
  console.log(strengths.sum());
};

const task2 = () => {
  let registerX = 1;
  let currentOperation;
  const operations = [];
  let executionCycle = 1;
  const CRT = [];
  let currentCRT = "";
  for (let index = 0; index < 260; index++) {
    if (index < lines.length) operations.push(lines[index]);
    currentOperation = operations[0];

    currentCRT += (index % 40).isBetweenOrEqual(registerX - 1, registerX + 1) ? "#" : " ";
    if ((index + 1) % 40 === 0) {
      CRT.push(currentCRT);
      currentCRT = "";
    }

    if (currentOperation === "noop") {
      operations.shift();
    } else if (currentOperation) {
      if (executionCycle === 2) {
        registerX += Number(currentOperation.split(" ")[1]);
        operations.shift();
        executionCycle = 1;
      } else {
        executionCycle = 2;
      }
    }
  }

  console.log(CRT);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
