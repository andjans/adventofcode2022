import data from "./input.js";
import testData from "./test.js";
import { djikstra } from "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const task1 = () => {
  const valves = testLines.reduce(
    (acc, line) => ({
      ...acc,
      [line.split(" ")[1]]: {
        isOpen: false,
        valve: line.split(" ")[1],
        rate: Number(line.split(" ")[4].split("=")[1].split(";")[0]),
        connections: line
          .split(" valv")[1]
          .split(" ")
          .slice(1)
          .map((v) => v.replaceAll("\n", "").replaceAll(",", "")),
      },
    }),
    {}
  );

  let minute = 0;
  let tot = 0;
  let current = valves.AA;
  const moves = [];
  current.isOpen = true;

  while (minute < 30) {
    const currentPressure = Object.keys(valves)
      .filter((valve) => valves[valve].isOpen)
      .map((valve) => valves[valve].rate)
      .sum();
    tot += currentPressure;

    console.log("current", minute, currentPressure, tot, current.valve);

    const allOpen = Object.keys(valves).every(
      (valve) => valves[valve].isOpen || valves[valve].rate === 0
    );
    if (allOpen) {
      console.log("all open");
      minute++;
      continue;
    }

    const bestMove = Object.keys(valves)
      .filter((key) => {
        return !valves[key].isOpen && valves[key].rate !== 0;
      })
      .reduce(
        (best, valveKey) => {
          if (valveKey === current.valve) return best;
          const valve = valves[valveKey];
          const shortestPathToValve = djikstra(
            Object.keys(valves).map((key) => ({
              value: key,
              connections: valves[key].connections,
            })),
            { value: current.valve, connections: current.connections },
            [valveKey]
          );
          if (best.ppm < valve.rate / shortestPathToValve.cost) {
            return {
              ppm: valve.rate / shortestPathToValve.cost,
              moves: shortestPathToValve.path.map((node) => node.value).slice(1),
            };
          }
          return best;
        },
        { ppm: -1, moves: [] }
      );
    //console.log("best", bestMove);

    if (moves.length === 0 && (current.isOpen || bestMove.ppm > current.rate)) {
      moves.push(...bestMove.moves);
    }

    if (moves.length > 0) {
      // Move
      console.log("move", moves[0]);
      minute++;
      current = valves[moves.shift()];
    } else {
      console.log("open", current.valve);
      // Open
      minute++;
      current.isOpen = true;
    }
  }

  console.log(tot);
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
