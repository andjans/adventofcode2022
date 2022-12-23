import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { Point } from "../../helpers/Point.js";
import { Grid } from "../../helpers/Grid.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const checkN = (others, elf) =>
  others.some((other) => other.x.isBetweenOrEqual(elf.x - 1, elf.x + 1) && other.y === elf.y + 1)
    ? null
    : { dir: 0, pos: elf, dest: [elf.x, elf.y + 1] };
const checkS = (others, elf) =>
  others.some((other) => other.x.isBetweenOrEqual(elf.x - 1, elf.x + 1) && other.y === elf.y - 1)
    ? null
    : { dir: 1, pos: elf, dest: [elf.x, elf.y - 1] };
const checkW = (others, elf) =>
  others.some((other) => other.y.isBetweenOrEqual(elf.y - 1, elf.y + 1) && other.x === elf.x - 1)
    ? null
    : { dir: 2, pos: elf, dest: [elf.x - 1, elf.y] };
const checkE = (others, elf) =>
  others.some((other) => other.y.isBetweenOrEqual(elf.y - 1, elf.y + 1) && other.x === elf.x + 1)
    ? null
    : { dir: 3, pos: elf, dest: [elf.x + 1, elf.y] };

const checkDirs = [checkN, checkS, checkW, checkE];

function playRounds(grid, maxRounds = 10) {
  let newCheckDirs = checkDirs.slice();
  let elfPos = grid.getAllWithType("#");
  for (let round = 1; round <= maxRounds; round++) {
    const purposals = [];
    for (const ep of elfPos) {
      const others = elfPos.filter(
        (other) => other.xy !== ep.xy && ep.distanceTo(other, true) === 1
      );
      if (others.length > 0) {
        let found = false;
        for (const checkDir of newCheckDirs) {
          const dir = checkDir(others, ep);
          if (dir) {
            purposals.push(dir);
            found = true;
            break;
          }
        }
        if (!found) purposals.push({ dir: -1, pos: ep, dest: [ep.x, ep.y] });
      } else {
        purposals.push({ dir: -1, pos: ep, dest: [ep.x, ep.y] });
      }
    }

    if (purposals.every((p) => p.dir === -1))
      return [Grid.createFromArrayOfRealPoints(elfPos, "."), round];

    const nextElvesPos = [];
    purposals.forEach((p) => {
      const sameAsOther = purposals
        .filter((other) => other !== p)
        .map((other) => other.dest)
        .some((other) => p.dest.shallowSame(other));
      if (!sameAsOther) {
        nextElvesPos.push(new Point(p.dest[0], p.dest[1], "#"));
      } else {
        nextElvesPos.push(p.pos);
      }
    });

    elfPos = nextElvesPos;

    if (round % 5 === 0) console.log("round " + round);

    const [dirToMove, ...otherDirs] = newCheckDirs;
    newCheckDirs = [...otherDirs, dirToMove];
  }
  return [Grid.createFromArrayOfRealPoints(elfPos, "."), maxRounds];
}

const task1 = () => {
  let grid = Grid.createFromArrayOfStrings(lines);
  let round;
  [grid, round] = playRounds(grid);
  grid.print("");
  console.log(round, grid.getAllWithType(".").length);
};

const task2 = () => {
  let grid = Grid.createFromArrayOfStrings(lines);
  let round;
  [grid, round] = playRounds(grid, Number.MAX_VALUE);
  //grid.print("");
  console.log(round, grid.getAllWithType(".").length);
};

console.log("---- task 1 ----");
//task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
