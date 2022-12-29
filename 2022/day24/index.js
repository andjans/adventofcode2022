import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { Grid } from "../../helpers/Grid.js";
import { directions, Point } from "../../helpers/Point.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const blizzardSigns = { right: ">", left: "<", up: "^", down: "v" };

const blizzardChecks = {
  left: (grid, point) =>
    point.x === 1
      ? grid.pointAt(grid.nColumns - 2, point.y)
      : grid.pointAt(point.left().x, point.y),
  right: (grid, point) =>
    point.x === grid.nColumns - 2
      ? grid.pointAt(1, point.y)
      : grid.pointAt(point.right().x, point.y),
  up: (grid, point) =>
    point.y === grid.nRows - 2 ? grid.pointAt(point.x, 1) : grid.pointAt(point.x, point.up().y),
  down: (grid, point) =>
    point.y === 1 ? grid.pointAt(point.x, grid.nRows - 2) : grid.pointAt(point.x, point.down().y),
};

const containsBlizzard = (point, sign) => {
  if (Array.isArray(point.type)) {
    return point.type.includes(sign);
  }
  return point.type === sign;
};

const isEmptySpot = (type) => {
  return Array.isArray(type) ? [".", "E"].includes(type[0]) : [".", "E"].includes(type);
};

const getPossibleSpots = (grid, current) => {
  const possibleAdjacent = grid.adjacentPoints(current).filter((p) => isEmptySpot(p.type));
  if (isEmptySpot(grid.pointAt(current.x, current.y).type)) {
    possibleAdjacent.push(current);
  }
  return possibleAdjacent;
};

const updateBlizzard = (grid) => {
  const updatedGrid = grid.copy();
  for (let x = 1; x < grid.nColumns - 1; x++) {
    for (let y = 1; y < grid.nRows - 1; y++) {
      const point = grid.pointAt(x, y);
      const newType = [];
      if (containsBlizzard(blizzardChecks.left(grid, point), blizzardSigns.right)) {
        newType.push(blizzardSigns.right);
      }
      if (containsBlizzard(blizzardChecks.right(grid, point), blizzardSigns.left)) {
        newType.push(blizzardSigns.left);
      }
      if (containsBlizzard(blizzardChecks.up(grid, point), blizzardSigns.down)) {
        newType.push(blizzardSigns.down);
      }
      if (containsBlizzard(blizzardChecks.down(grid, point), blizzardSigns.up)) {
        newType.push(blizzardSigns.up);
      }
      if (newType.length === 0) {
        newType.push(".");
      }
      updatedGrid.setPointAt(x, y, newType);
    }
  }
  return updatedGrid;
};

const findBestPath = (grid, start, end) => {
  let endReached = false;
  let moves = 0;
  let current = [start];
  let updatedGrid = grid.copy();
  while (!endReached) {
    // Update blizzards
    updatedGrid = updateBlizzard(updatedGrid);

    const newCurrent = [];

    for (const position of current) {
      // Check if end is reachable
      const possibleSpots = getPossibleSpots(updatedGrid, position);
      if (possibleSpots.map((p) => p.y).includes(end.y)) {
        console.log("END REACHED!", moves + 1);
        endReached = true;
        return [moves + 1, updatedGrid];
      }

      // Add all possible positions to next iteration
      possibleSpots.forEach((spot) => {
        if (!newCurrent.map((p) => p.xy).includes(spot.xy)) {
          newCurrent.push(spot);
        }
      });
    }

    current = newCurrent;
    moves++;
  }
};

const task1 = () => {
  const grid = Grid.createFromArrayOfStrings(testLines);
  const start = new Point(1, grid.nRows - 1);
  const end = new Point(grid.nColumns - 2, 0);

  const best = findBestPath(grid, start, end);
  best[1].print();
  console.log(best[0]);
};

const task2 = () => {
  const grid = Grid.createFromArrayOfStrings(lines);

  const start = new Point(1, grid.nRows - 1);
  const end = new Point(grid.nColumns - 2, 0);

  const best = findBestPath(grid, start, end);
  console.log(best[0]);
  const back = findBestPath(best[1], end, start);
  console.log(back[0]);
  const backAgain = findBestPath(back[1], start, end);
  console.log(backAgain[0]);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
