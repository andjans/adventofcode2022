import data from "./input.js";
import data2 from "./input2.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { Point } from "../../helpers/Point.js";
import { Grid } from "../../helpers/Grid.js";

const lines = [...data.split("\n"), ...data2.split("\n")];
const testLines = testData.split("\n");

const directions = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, 1],
  D: [0, -1],
};

const task1 = () => {
  let head = new Point(0, 0, "h");
  let tail = new Point(0, 0, "#");
  const tailPositions = [tail.xy];

  lines.splitEachElementBy(" ").forEach((line) => {
    for (let i = 0; i < Number(line[1]); i++) {
      const move = directions[line[0]];
      head = new Point(head.x + move[0], head.y + move[1], head.type);
      if (head.x !== tail.x || head.y !== tail.y) {
        if (head.distanceTo(tail, true) > 1) {
          tail = new Point(Math.abs(head.x - tail.x) > 1 ? tail.x + move[0] : head.x, Math.abs(head.y - tail.y) > 1 ? tail.y + move[1] : head.y, tail.type);
          tailPositions.push(tail.xy);
        }
      }
    }
  });

  console.log(tailPositions.unique().length);
};

const task2 = () => {
  const knots = [];
  for (let i = 0; i < 9; i++) {
    knots.push(new Point(0, 0, "-"));
  }
  knots.push(new Point(0, 0, "#"));
  const tailPositions = [knots[9]];

  testLines.splitEachElementBy(" ").forEach((line) => {
    for (let i = 0; i < Number(line[1]); i++) {
      const move = directions[line[0]];
      let head = knots[0];
      head = new Point(head.x + move[0], head.y + move[1], head.type);
      knots.splice(0, 1, head);
      for (let j = 1; j < 10; j++) {
        let tail = knots[j];
        if (head.x !== tail.x || head.y !== tail.y) {
          if (head.distanceTo(tail, true) > 1) {
            tail = new Point(
              Math.abs(head.x - tail.x) > 1 ? tail.x + (head.x - tail.x > 0 ? 1 : -1) : head.x,
              Math.abs(head.y - tail.y) > 1 ? tail.y + (head.y - tail.y > 0 ? 1 : -1) : head.y,
              tail.type
            );
            knots.splice(j, 1, tail);
            if (j === 9) tailPositions.push(tail);
          }
        }
        head = knots[j];
      }
    }
  });

  const g = Grid.createFromArrayOfPoints(
    tailPositions.map((pos) => [pos.x, pos.y, pos.type]),
    "-"
  );
  g.print();
  console.log(g.getAllNonEmpty().length);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
