import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

function countTotalSides(cubes) {
  let totSides = 0;
  cubes.forEach((cube, index) => {
    let sides = 6;
    cube.forEach((axis, aIndex) => {
      for (const [i, cube_] of cubes.entries()) {
        if (i !== index) {
          if (cube_[aIndex] === axis + 1 || cube_[aIndex] === axis - 1) {
            const others = cube.slice();
            others.splice(aIndex, 1);
            const others2 = cube_.slice();
            others2.splice(aIndex, 1);
            if (others.shallowSame(others2)) {
              sides--;
            }
          }
        }
      }
    });
    totSides += sides;
  });
  return totSides;
}

function countTotalSidesOuter(cubes) {
  let totSides = 0;
  cubes.forEach((cube) => {
    const xValues = cubes.filter((c) => c[1] === cube[1] && c[2] === cube[2]).map((c) => c[0]);
    const yValues = cubes.filter((c) => c[0] === cube[0] && c[2] === cube[2]).map((c) => c[1]);
    const zValues = cubes.filter((c) => c[1] === cube[1] && c[0] === cube[0]).map((c) => c[2]);
    totSides +=
      [xValues.min(), xValues.max()].count(cube[0]) +
      [yValues.min(), yValues.max()].count(cube[1]) +
      [zValues.min(), zValues.max()].count(cube[2]);
  });
  return totSides;
}

const task1 = () => {
  const cubes = lines.splitEachElementBy(",").map((el) => el.toNumber());
  let totSides = countTotalSides(cubes);
  console.log(totSides);
};

const task2 = () => {
  const cubes = lines.splitEachElementBy(",").map((el) => el.toNumber());
  let totSides = countTotalSidesOuter(cubes);
  console.log(totSides);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
