import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { P } from "../../helpers/Point.js";
import { Grid } from "../../helpers/Grid.js";

const lines = data.split("");
const testLines = testData.split("");

/**
 * I AM NOT PROUD OF THE BRUTEFORCE SOLUTION HERE, BUT AT LEAST IT WORKED.
 */


const rocks = [
  [P(0, 0), P(1, 0), P(2, 0), P(3, 0)],
  [P(1, 0), P(0, 1), P(1, 1), P(2, 1), P(1, 2)],
  [P(0, 0), P(1, 0), P(2, 0), P(2, 1), P(2, 2)],
  [P(0, 0), P(0, 1), P(0, 2), P(0, 3)],
  [P(0, 0), P(1, 0), P(0, 1), P(1, 1)],
];

function detectCycles(grid, rockIndex, jetIndex, rockStopPositions) {
  if (grid.nRows > 55 && rockIndex > 5002) {
    for (let nRows = Math.floor(grid.nRows / 2.5); nRows > 3; nRows--) {
      /*for (
        let topRow = grid.nRows - 2;
        grid.nRows - 1 - topRow < nRows && topRow > nRows * 2;
        topRow--
      ) {*/
      let topRow = grid.nRows - 50;
      const top = grid.toSubGrid(
        grid.pointAt(0, topRow - nRows + 1),
        grid.pointAt(grid.nColumns - 1, topRow),
        false
      );
      const next = grid.toSubGrid(
        grid.pointAt(0, topRow - nRows * 2 + 1),
        grid.pointAt(grid.nColumns - 1, topRow - nRows),
        false
      );

      if (top.same(next)) {
        const nAbove = grid.nRows - 1 - topRow;
        if (nAbove > nRows || nAbove === 0) continue;
        const nBelow = nRows - nAbove;
        const above = grid.toSubGrid(
          grid.pointAt(0, topRow + 1),
          grid.pointAt(grid.nColumns - 1, grid.nRows - 1),
          false
        );
        const below = grid.toSubGrid(
          grid.pointAt(0, topRow - nBelow),
          grid.pointAt(grid.nColumns - 1, topRow),
          false
        );
        const bottomOfTop = top.toSubGrid(
          top.pointAt(0, 0),
          top.pointAt(top.nColumns - 1, nAbove - 1),
          false
        );
        const topOfTop = top.toSubGrid(
          top.pointAt(0, nAbove),
          top.pointAt(top.nColumns - 1, top.nRows - 1),
          false
        );
        const rockNumbers = rockStopPositions
          .filter(
            (pos) =>
              pos[2] === grid.nRows - 1 - nAbove || pos[2] === grid.nRows - 1 - (nAbove + nRows)
          )
          .map((pos) => pos[0]);

        if (above.same(bottomOfTop) && rockNumbers.length === 2) {
          console.log("CYCLES FOUND!!", { nRows, topRow, nAbove, nBelow, rockNumbers });
          return {
            nAbove,
            nBelow: grid.nRows - (nRows + nAbove),
            cycleHeight: nRows,
            numberOfRocksPerCycle: rockNumbers.max() - rockNumbers.min(),
          };
        }
      }
    }
    //}
  }
  return null;
}

function simulate(jets, nTotalRocks, removeLevels = false) {
  let grid = new Grid(1, 1, ".");
  let moveSideways = true;
  let removedLevels = 0;
  let jetPosition = 0;
  let foundCycles = false;
  const rockStopPositions = [];
  for (
    let rockDropTotIndex = 0;
    rockDropTotIndex < nTotalRocks && !foundCycles;
    rockDropTotIndex++
  ) {
    let rockSettled = false;
    let rock = rocks[rockDropTotIndex % rocks.length].slice();
    const settledRocks = grid.getAllNonEmpty();
    const highestRock = settledRocks.length === 0 ? -1 : settledRocks.map((p) => p.y).max();
    let leftOffset = 2;
    let bottomOffset = highestRock + 4;
    while (!rockSettled && !foundCycles) {
      const newRock = rock.map((point) => P(point.x + leftOffset, point.y + bottomOffset));
      if (!newRock.some((rp) => settledRocks.some((sp) => rp.x === sp.x && rp.y === sp.y))) {
        rock = newRock;
      }
      if (moveSideways) {
        // move side
        const direction = jets[jetPosition++ % jets.length];
        bottomOffset = 0;
        leftOffset = direction === "<" ? -1 : 1;
        const newLeft = rock.map((r) => r.x).min() + leftOffset;
        const newRight = rock.map((r) => r.x).max() + leftOffset;
        if (newLeft < 0) leftOffset = 0;
        if (newRight > 6) leftOffset = 0;
        moveSideways = false;
      } else if (
        rock.some(
          (rp) => rp.y === 0 || settledRocks.some((sp) => rp.x === sp.x && rp.y === sp.y + 1)
        )
      ) {
        // Settle rock
        grid = Grid.createFromArrayOfRealPoints([...grid.getAllNonEmpty(), ...rock]);
        rockStopPositions.push([rockDropTotIndex, jetPosition % jets.length, grid.nRows - 1]);

        // Experimental - Remove levels
        if (removeLevels) {
          for (let j = grid.nRows - 1; j >= 1; j--) {
            const pointsOnLine = grid.filterOnLine(1, 0, 0, j, true, false);
            if (pointsOnLine.length === 7) {
              console.log("SMASH!", j, rockDropTotIndex % rocks.length, jetPosition % jets.length);
              grid = grid.toSubGrid(grid.pointAt(0, j), undefined, false);
              removedLevels += j;
              break;
            }
          }
        }

        const cycles = detectCycles(
          grid,
          rockDropTotIndex,
          jetPosition % jets.length,
          rockStopPositions,
          nTotalRocks
        );
        if (cycles) {
          console.log("CYCLES", cycles);

          const nCycles = Math.floor(
            (nTotalRocks - rockDropTotIndex) / cycles.numberOfRocksPerCycle
          );
          const otherRocks = (nTotalRocks - rockDropTotIndex) % cycles.numberOfRocksPerCycle;

          const fr = rockDropTotIndex - cycles.numberOfRocksPerCycle;
          const found = rockStopPositions.find((pos) => pos[0] === fr);
          const found2 = rockStopPositions.find((pos) => pos[0] === fr + otherRocks - 1);
          console.log(otherRocks, found, found2);
          const left = found2[2] - found[2];
          const totCycleHeight = nCycles * cycles.cycleHeight;
          console.log(
            grid.nRows,
            rockDropTotIndex,
            totCycleHeight,
            left,
            grid.nRows + totCycleHeight + left
          );
          foundCycles = true;
        }

        moveSideways = true;
        rockSettled = true;
        bottomOffset = 0;
        leftOffset = 0;
      } else {
        // Move down
        bottomOffset = -1;
        leftOffset = 0;
        moveSideways = true;
      }
    }
  }
}

const task1 = () => {
  simulate(lines, 2022);
};

const task2 = () => {
  const start = new Date().getTime();
  //simulate(lines, 5022);
  simulate(lines, 1000000000000);
  console.log("time", (new Date().getTime() - start) / 1000);
};

console.log("---- task 1 ----");
//task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
