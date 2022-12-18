import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { Point, EmptyPoint } from "../../helpers/Point.js";
import { Grid } from "../../helpers/Grid.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const getPoints = (p1, p2) => {
  const points = [];
  for (let x = Math.min(p1[0], p2[0]); x <= Math.max(p1[0], p2[0]); x++) {
    for (let y = Math.min(p1[1], p2[1]); y <= Math.max(p1[1], p2[1]); y++) {
      points.push([x, y, "#"]);
    }
  }
  return points;
};

const task1 = () => {
  const paths = lines.reduce((paths, line) => {
    const coords = line.split(" -> ");
    for (let i = 0; i < coords.length - 1; i++) {
      const points = getPoints(
        coords[i].split(",").toNumber(),
        coords[i + 1].split(",").toNumber()
      );
      paths = [...paths, ...points.except(paths)];
    }
    return paths;
  }, []);
  const grid = Grid.createFromArrayOfPoints(paths, ".");
  grid.setPointAt(500, 0, "+");
  let drop = true;
  while (drop) {
    let move = true;
    let next = new Point(500, 1);
    while (move) {
      if (next.y >= grid.nRows - 1) {
        move = false;
        drop = false;
      } else if (grid.pointAt(next.up().x, next.up().y) instanceof EmptyPoint) {
        next = next.up();
      } else if (grid.pointAt(next.left().x, next.up().y) instanceof EmptyPoint) {
        next = next.left().up();
      } else if (grid.pointAt(next.right().x, next.up().y) instanceof EmptyPoint) {
        next = next.right().up();
      } else {
        if (grid.pointAt(next.x, next.y).type !== "o") grid.setPointAt(next.x, next.y, "o");
        else drop = false;
        move = false;
      }
    }
  }
  console.log(grid.getAllWithType("o").length);
};

const task2 = () => {
  let paths = lines.reduce((paths, line) => {
    const coords = line.split(" -> ");
    for (let i = 0; i < coords.length - 1; i++) {
      const points = getPoints(
        coords[i].split(",").toNumber(),
        coords[i + 1].split(",").toNumber()
      );
      paths = [...paths, ...points.except(paths)];
    }
    return paths;
  }, []);

  const [maxX, maxY] = paths.reduce(
    (ends, rock) => {
      if (rock[0] > ends[0]) ends[0] = rock[0];
      if (rock[1] > ends[1]) ends[1] = rock[1];
      return ends;
    },
    [0, 0]
  );
  const points = getPoints([0, maxY + 2], [maxX * 2, maxY + 2]);
  paths = [...paths, ...points.except(paths)];
  const grid = Grid.createFromArrayOfPoints(paths, ".");
  grid.setPointAt(500, 0, "+");

  let drop = true;
  while (drop) {
    let move = true;
    let next = new Point(500, 0);
    while (move) {
      if (next.y >= grid.nRows - 1) {
        move = false;
        drop = false;
      } else if (grid.pointAt(next.up().x, next.up().y) instanceof EmptyPoint) {
        next = next.up();
      } else if (grid.pointAt(next.left().x, next.up().y) instanceof EmptyPoint) {
        next = next.left().up();
      } else if (grid.pointAt(next.right().x, next.up().y) instanceof EmptyPoint) {
        next = next.right().up();
      } else {
        if (grid.pointAt(next.x, next.y).type !== "o") grid.setPointAt(next.x, next.y, "o");
        else drop = false;
        move = false;
      }
    }
  }
  console.log(grid.getAllWithType("o").length);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
