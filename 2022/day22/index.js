import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { Grid } from "../../helpers/Grid.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const dirs = [
  [1, 0],
  [0, -1],
  [-1, 0],
  [0, 1],
];
const signs = [">", "v", "<", "^"];
const task1 = () => {
  const [g, m] = lines.splitByElement("");
  const grid = Grid.createFromArrayOfStrings(g, " ");
  const startX = grid.filterOnLine(1, 0, 0, grid.nRows - 1, true).find((p) => {
    return p.type === ".";
  }).x;
  let current = grid.pointAt(startX, grid.nRows - 1);
  let dir = 0;
  const letters = m[0].split("").filter((e) => isNaN(parseInt(e, 10)));
  m[0].getNumbers().forEach((n, index, a) => {
    grid.setPointAt(current.x, current.y, signs[dir]);
    console.log(current.xy, current.type);
    //grid.print("");
    const points = grid.filterOnLine(
      dirs[dir][0],
      dirs[dir][1],
      [0, current.x, grid.nColumns - 1, current.x][dir],
      [current.y, grid.nRows - 1, current.y, 0][dir],
      true
    );
    let i = 0;
    let lasti = -1;
    const pos = [
      current.x + 1,
      points.length - current.y,
      points.length - current.x,
      current.y + 1,
    ][dir];
    for (i; i < n; i++) {
      const p = points[(pos + i) % points.length];
      if (p.type === " ") {
        ++n;
        continue;
      }
      if (p.type === "#") {
        break;
      } else {
        grid.setPointAt(p.x, p.y, signs[dir]);
        lasti = i;
      }
    }
    if (lasti >= 0) {
      current = points[(pos + lasti) % points.length];
    }
    if (letters.length - 1 >= index) {
      letters[index] === "R" ? ++dir : --dir;
      dir = (dir + dirs.length) % dirs.length;
    }
  });

  grid.print("");

  const finalRow = grid.nRows - current.y;
  const finalColumn = current.x + 1;
  const finalDir = [0, 1, 2, 3][dir];
  console.log(finalRow, finalColumn, finalDir);
  console.log(finalRow * 1000 + finalColumn * 4 + finalDir);
  // TO HIGH 48304
};

const task2 = () => {
  const [g, m] = lines.splitByElement("");
  const grid = Grid.createFromArrayOfStrings(g, " ");
  const startX = grid.filterOnLine(1, 0, 0, grid.nRows - 1, true).find((p) => {
    return p.type === ".";
  }).x;
  let current = grid.pointAt(startX, grid.nRows - 1);
  let dir = 0;
  const letters = m[0].split("").filter((e) => isNaN(parseInt(e, 10)));
  m[0].getNumbers().forEach((n, index, a) => {
    grid.setPointAt(current.x, current.y, signs[dir]);
    //console.log(current.xy, current.type);
    //grid.print("");

    let i = 0;
    const posPerSide = grid.nColumns / 3;
    let lastXY = [current.x, current.y];
    let nextXY = [current.x + dirs[dir][0], current.y + dirs[dir][1]];
    for (i; i < n; i++) {
      if (i > 0) {
        nextXY = [nextXY[0] + dirs[dir][0], nextXY[1] + dirs[dir][1]];
      }

      let nextDir = dir;
      if (
        nextXY[0] < 0 ||
        (nextXY[1] >= 0 &&
          nextXY[1] < grid.nRows &&
          nextXY[0] < grid.nColumns &&
          grid.pointAt(nextXY[0], nextXY[1]).type === " " &&
          dir === 2)
      ) {
        // Moved out left
        if (nextXY[1] >= posPerSide * 3) {
          nextXY = [0, posPerSide * 5 - nextXY[1] - 1];
          // DIR = right
          nextDir = 0;
        } else if (nextXY[1] >= posPerSide * 2) {
          nextXY = [posPerSide * 3 - nextXY[1] - 1, posPerSide * 2 - 1];
          // DIR = down
          nextDir = 1;
        } else if (nextXY[1] >= posPerSide) {
          nextXY = [posPerSide, posPerSide * 5 - nextXY[1] - 1];
          // DIR = right
          nextDir = 0;
        } else {
          nextXY = [posPerSide * 2 - nextXY[1] - 1, posPerSide * 4 - 1];
          // DIR = down
          nextDir = 1;
        }
      } else if (
        nextXY[0] >= grid.nColumns ||
        (nextXY[1] >= 0 &&
          nextXY[1] < grid.nRows &&
          nextXY[0] >= 0 &&
          nextXY[0] < grid.nColumns &&
          grid.pointAt(nextXY[0], nextXY[1]).type === " " &&
          dir === 0)
      ) {
        // Moved out right
        if (nextXY[1] >= posPerSide * 3) {
          nextXY = [posPerSide * 2 - 1, posPerSide * 5 - nextXY[1] - 1];
          // DIR = left
          nextDir = 2;
        } else if (nextXY[1] >= posPerSide * 2) {
          nextXY = [posPerSide * 5 - nextXY[1] - 1, posPerSide * 3];
          // DIR = up
          nextDir = 3;
        } else if (nextXY[1] >= posPerSide) {
          nextXY = [posPerSide * 3 - 1, posPerSide * 5 - nextXY[1] - 1];
          // DIR = left
          nextDir = 2;
        } else {
          nextXY = [posPerSide * 2 - nextXY[1] - 1, posPerSide];
          // DIR = up
          nextDir = 3;
        }
      } else if (
        nextXY[1] < 0 ||
        (nextXY[1] >= 0 &&
          nextXY[1] < grid.nRows &&
          nextXY[0] >= 0 &&
          nextXY[0] < grid.nColumns &&
          grid.pointAt(nextXY[0], nextXY[1]).type === " " &&
          dir === 1)
      ) {
        // Moved out down
        if (nextXY[0] >= posPerSide * 2) {
          nextXY = [posPerSide * 2 - 1, posPerSide * 5 - nextXY[0] - 1];
          // DIR = left
          nextDir = 2;
        } else if (nextXY[0] >= posPerSide) {
          nextXY = [posPerSide - 1, posPerSide * 2 - nextXY[0] - 1];
          // DIR = left
          nextDir = 2;
        } else {
          nextXY = [posPerSide * 2 + nextXY[0], posPerSide * 4 - 1];
          // DIR = down
          nextDir = 1;
        }
      } else if (
        nextXY[1] > grid.nRows - 1 ||
        (nextXY[1] >= 0 &&
          nextXY[1] < grid.nRows &&
          nextXY[0] >= 0 &&
          nextXY[0] < grid.nColumns &&
          grid.pointAt(nextXY[0], nextXY[1]).type === " " &&
          dir === 3)
      ) {
        // Moved out up
        if (nextXY[0] >= posPerSide * 2) {
          nextXY = [nextXY[0] - posPerSide * 2, 0];
          // DIR = up
          nextDir = 3;
        } else if (nextXY[0] >= posPerSide) {
          nextXY = [0, posPerSide * 2 - nextXY[0] - 1];
          // DIR = right
          nextDir = 0;
        } else {
          nextXY = [posPerSide, posPerSide * 3 - nextXY[0] - 1];
          // DIR = right
          nextDir = 0;
        }
      }

      if (grid.pointAt(nextXY[0], nextXY[1]).type === "#") {
        break;
      }

      dir = nextDir;

      if (grid.pointAt(nextXY[0], nextXY[1]).type === " ") {
        ++n;
      } else {
        grid.setPointAt(nextXY[0], nextXY[1], signs[dir]);
        lastXY = nextXY;
      }
    }

    current = grid.pointAt(lastXY[0], lastXY[1]);

    if (index < a.length - 1) {
      letters[index] === "R" ? ++dir : --dir;
      dir = (dir + dirs.length) % dirs.length;
    }
  });

  grid.print("");

  const finalRow = grid.nRows - current.y;
  const finalColumn = current.x + 1;
  const finalDir = [0, 1, 2, 3][dir];
  console.log(finalRow, finalColumn, finalDir);
  console.log(finalRow * 1000 + finalColumn * 4 + finalDir);
};

console.log("---- task 1 ----");
//task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
