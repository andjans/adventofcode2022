import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

//const lines = data.split("\n");
//const testLines = testData.split("\n");

const checkPairs = (p1, p2) => {
  if (Array.isArray(p1)) {
    if (Array.isArray(p2)) {
      // Array, Array
      for (let i = 0; i < Math.min(p1.length, p2.length); i++) {
        const check = checkPairs(p1[i], p2[i]);
        if (check !== 0) return check;
      }
      return p1.length - p2.length;
    } else {
      // Array, Number
      return checkPairs(p1, [p2]);
    }
  } else {
    if (Array.isArray(p2)) {
      // Number, Array
      return checkPairs([p1], p2);
    } else {
      // Number, Number
      return p1 - p2;
    }
  }
};

const task1 = () => {
  const x = data.reduce((acc, pair, index) => {
    const p1 = pair[0];
    const p2 = pair[1];
    if (checkPairs(p1, p2) <= 0) {
      acc.push(index + 1);
      return acc;
    } else {
      return acc;
    }
  }, []);
  console.log(x);
  console.log(x.sum());
};

const task2 = () => {
  const d1 = [[2]];
  const d2 = [[6]];
  const arrays = data.flat();
  arrays.push(d1, d2);
  arrays.sort((a1, a2) => {
    return checkPairs(a1, a2);
  }, []);
  console.log(arrays.indexOf(d1) + 1, arrays.indexOf(d2) + 1);
  console.log((arrays.indexOf(d1) + 1) * (arrays.indexOf(d2) + 1));
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
