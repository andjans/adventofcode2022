import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const getMultiplier = (index) => {
  return Math.pow(5, index);
};

const getSnafuValue = (char) => {
  switch (char) {
    case "=":
      return -2;
    case "-":
      return -1;
    default:
      return Number(char);
  }
};

const getChar = (snafuValue) => {
  switch (snafuValue) {
    case -2:
      return "=";
    case -1:
      return "-";
    default:
      return snafuValue.toString();
  }
};

const snafuToDecimal = (snafu) => {
  const parts = snafu.split("");
  return parts.reduce((acc, curr, index) => {
    return acc + getSnafuValue(curr) * getMultiplier(parts.length - index - 1);
  }, 0);
};

const getExp = (decimal) => {
  if (decimal === 0) return 0;
  let exp = 0;
  let high = 0;
  while (true) {
    const low = Math.pow(5, exp) - high;
    high = 3 * Math.pow(5, exp) - low;
    if (decimal.isBetweenOrEqual(low, high)) {
      const mid = Math.pow(5, exp) + low;
      return [decimal < mid ? 1 : 2, exp];
    }
    exp++;
  }
};

const getMax = (index) => {
  return snafuToDecimal(new Array(index).fill("2").join(""));
};

const decimalToSnafu = (decimal) => {
  let result = "";
  const [snafuValue, exp] = getExp(decimal);
  result += snafuValue;
  let rest = decimal - Math.pow(5, exp) * snafuValue;
  for (let currentExp = exp; currentExp > 0; currentExp--) {
    if (rest === 0) {
      result += "0";
      continue;
    }

    const curr = Math.pow(5, currentExp - 1);
    const max = getMax(currentExp - 1);
    // -1103
    if (Math.abs(rest) <= max) {
      result += "0";
    } else if (Math.abs(rest) > curr + max) {
      const value = rest < 0 ? -2 : 2;
      result += getChar(value);
      rest -= curr * value;
    } else {
      const value = rest < 0 ? -1 : 1;
      result += getChar(value);
      rest -= curr * value;
    }
  }
  return result;
};

const task1 = () => {
  console.log(decimalToSnafu(lines.map((line) => snafuToDecimal(line)).sum()));
};

const task2 = () => {};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
