import crates from "./crates.js";
import data from "./input.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const crateLinesInitial = crates.split("\n");

const task1 = () => {
  const crateLines = [...crateLinesInitial].splitEachElementBy(",");
  lines.forEach((line) => {
    let split = line.split("move");
    split = split[1].split(" from ");
    const fromTo = split[1].split(" to ");
    const count = Number(split[0]);
    const crateLineFrom = crateLines[fromTo[0] - 1];
    let crateLineTo = crateLines[fromTo[1] - 1];
    let toMove = [];

    for (let i = 0; i < crateLineFrom.length; i++) {
      const char = crateLineFrom[i];
      crateLineFrom[i] = "#";
      if (char !== "#") {
        toMove.push(char);
        if (toMove.length === count) {
          break;
        }
      }
    }
    crateLines[fromTo[0] - 1] = crateLineFrom;
    toMove = toMove.reverse();

    for (let i = crateLineTo.length - 1; i >= 0; i--) {
      const char = crateLineTo[i];
      if (char === "#") {
        crateLineTo[i] = toMove.pop();
      }
      if (toMove.length === 0) {
        break;
      }
    }
    crateLineTo = [...toMove, ...crateLineTo];
    crateLines[fromTo[1] - 1] = crateLineTo;
  });

  let final = "";
  crateLines.forEach((line) => {
    for (const element of line) {
      if (element !== "#") {
        final += element;
        break;
      }
    }
  });

  console.log(final);
};

const task2 = () => {
  const crateLines = [...crateLinesInitial].splitEachElementBy(",");
  lines.forEach((line) => {
    let split = line.split("move");
    split = split[1].split(" from ");
    const fromTo = split[1].split(" to ");
    const count = Number(split[0]);
    const crateLineFrom = crateLines[fromTo[0] - 1];
    let crateLineTo = crateLines[fromTo[1] - 1];
    const toMove = [];

    for (let i = 0; i < crateLineFrom.length; i++) {
      const char = crateLineFrom[i];
      crateLineFrom[i] = "#";
      if (char !== "#") {
        toMove.push(char);
        if (toMove.length === count) {
          break;
        }
      }
    }
    crateLines[fromTo[0] - 1] = crateLineFrom;

    for (let i = crateLineTo.length - 1; i >= 0; i--) {
      const char = crateLineTo[i];
      if (char === "#") {
        crateLineTo[i] = toMove.pop();
      }
      if (toMove.length === 0) {
        break;
      }
    }
    crateLineTo = [...toMove, ...crateLineTo];
    crateLines[fromTo[1] - 1] = crateLineTo;
  });

  let final = "";
  crateLines.forEach((line) => {
    for (const element of line) {
      if (element !== "#") {
        final += element;
        break;
      }
    }
  });

  console.log(final);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
