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

  let minutesLeft = 30;
  const tot = 0;
  const state = {
    valves,
    position: "AA",
    minute: 30,
    totReleased: 0,
    path: ["AA"],
  };
  let states = [state];

  while (minutesLeft > 0) {
    // Only keep top 20 states
    states.sort((a, b) => a.totReleased - b.totReleased);
    states = states.slice(0, 20);

    const newStates = [];
    for (const currentState of states) {
      const currentValve = currentState.valves[currentState.position];
      const connections = currentValve.connections;

      // Release pressure
      for (const valve of currentState.valves) {
        if (valve.isOpen) {
          currentState.totReleased = currentState.totReleased + valve.rate;
        }
      }

      // Open valve
      if (!currentValve.isOpen && currentValve.rate > 0) {
        const newValves = [...currentState.valves];
        newValves[currentState.position] = { ...currentValve, isOpen: true };
        newStates.push({
          valves: newValves,
          position: currentState.position,
          minute: currentState.minute - 1,
          totReleased: currentState.totReleased,
          path: currentState.path,
        });
      }

      // Go to connections
      for (const connection of connections) {
        // Go to connection
        newStates.push({
          valves: currentState.valves,
          position: connection,
          minute: currentState.minute - 1,
          totReleased: currentState.totReleased,
          path: [...currentState.path, connection],
        });
      }
    }
    states = newStates;
    minutesLeft--;
  }

  console.log(tot);
};

const task1_DP = () => {
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

  const tot = 0;
  const state = {
    valves,
    position: "AA",
    minute: 30,
    totReleased: 0,
    path: ["AA"],
  };
  const states = [state];

  while (states.length > 0) {
    const currentState = states.shift();
    const currentValve = currentState.valves[currentState.position];
    const connections = currentValve.connections;

    // Release pressure
    for (const valve of currentState.valves) {
      if (valve.isOpen) {
        currentState.totReleased = currentState.totReleased + valve.rate;
      }
    }

    // Check if best
    if (currentState.minute === 0) {
      continue;
    }

    // Open valve
    if (!currentValve.isOpen && currentValve.rate > 0) {
      const newValves = [...currentState.valves];
      newValves[currentState.position] = { ...currentValve, isOpen: true };
      states.push({
        valves: newValves,
        position: currentState.position,
        minute: currentState.minute - 1,
        totReleased: currentState.totReleased,
        path: currentState.path,
      });
    }

    // Go to connections
    for (const connection of connections) {
      // Go to connection
      states.push({
        valves: currentState.valves,
        position: connection,
        minute: currentState.minute - 1,
        totReleased: currentState.totReleased,
        path: [...currentState.path, connection],
      });
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
