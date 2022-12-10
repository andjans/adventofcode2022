import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { Grid } from "../../helpers/Grid.js";
import { Point } from "../../helpers/Point.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const steps = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

const task1 = () => {
  const grid = Grid.createFromArrayOfArrays(lines.splitEachElementBy("").toNumber());
  const visibleInner = grid
    .filterByMultipleStep(1, 1, [1, 1], [grid.nColumns - 2, grid.nRows - 2])
    .filter((point) => steps.some((step) => grid.filterByStep(step[0], step[1], point.x, point.y, false).every((p) => p.type < point.type)));
  console.log(visibleInner.length + grid.nColumns * 2 + (grid.nRows - 2) * 2);
};

const task1_old = () => {
  const grid = Grid.createFromArrayOfStrings(lines);
  const subGrid = grid.toSubGrid(new Point(1, 1), new Point(grid.nColumns - 2, grid.nRows - 2));

  const nTreesOuter = grid.nTotalPoints - subGrid.nTotalPoints;

  const visible = subGrid.getAllNonEmpty().filter((point) => {
    return (
      grid.allPointsX(point.x + 1).every((pointX) => pointX.y >= point.y + 1 || Number(pointX.type) < Number(point.type)) ||
      grid.allPointsX(point.x + 1).every((pointX) => pointX.y <= point.y + 1 || Number(pointX.type) < Number(point.type)) ||
      grid.allPointsY(point.y + 1).every((pointY) => pointY.x >= point.x + 1 || Number(pointY.type) < Number(point.type)) ||
      grid.allPointsY(point.y + 1).every((pointY) => pointY.x <= point.x + 1 || Number(pointY.type) < Number(point.type))
    );
  });

  console.log(visible.length + nTreesOuter);
};

function countVisible(value, grid, pointFrom, pointTo, reverse) {
  let allNonEmpty = grid.toSubGrid(pointFrom, pointTo).getAllNonEmpty();
  allNonEmpty = reverse ? allNonEmpty.reverse() : allNonEmpty;
  allNonEmpty = allNonEmpty.map((point) => Number(point.type));
  let count = 0;
  for (const element of allNonEmpty) {
    count++;
    if (element >= value) {
      break;
    }
  }
  return count;
}

const task2 = () => {
  const grid = Grid.createFromArrayOfStrings(lines);
  const best = grid.getAllNonEmpty().reduce(
    (best, point) => {
      const above =
        point.y === grid.nRows - 1 ? 0 : countVisible(Number(point.type), grid, new Point(point.x, point.y + 1), new Point(point.x, grid.nRows - 1));
      const below = point.y === 0 ? 0 : countVisible(Number(point.type), grid, new Point(point.x, 0), new Point(point.x, point.y - 1), true);
      const right =
        point.x === grid.nColumns - 1 ? 0 : countVisible(Number(point.type), grid, new Point(point.x + 1, point.y), new Point(grid.nColumns - 1, point.y));
      const left = point.x === 0 ? 0 : countVisible(Number(point.type), grid, new Point(0, point.y), new Point(point.x - 1, point.y), true);
      const total = above * below * left * right;
      return best[1] <= total ? [point, total] : best;
    },
    [null, 0]
  );
  console.log(best[0], [best[1]]);
};

console.log("---- task 1 ----");
task1_old();
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
