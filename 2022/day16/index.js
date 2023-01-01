import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const task1 = () => {
  const valves = lines.reduce(
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
  const state = {
    valves,
    position: "AA",
    minute: 30,
    totReleased: 0,
    path: ["AA"],
  };
  let states = [state];

  while (minutesLeft > 0) {
    // Only keep top 50 states
    states.sort((a, b) => b.totReleased - a.totReleased);
    states = states.slice(0, 450);

    const newStates = [];
    for (const currentState of states) {
      const currentValve = currentState.valves[currentState.position];
      const connections = currentValve.connections;

      // Release pressure
      for (const valve of Object.values(currentState.valves)) {
        if (valve.isOpen) {
          currentState.totReleased = currentState.totReleased + valve.rate;
        }
      }

      // Open valve
      if (!currentValve.isOpen && currentValve.rate > 0) {
        const newValves = { ...currentState.valves };
        newValves[currentState.position] = { ...currentValve, isOpen: true };
        newStates.push({
          valves: newValves,
          position: currentState.position,
          minute: currentState.minute - 1,
          totReleased: currentState.totReleased,
          path: [...currentState.path, currentState.position],
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

  states.sort((a, b) => b.totReleased - a.totReleased);
  console.log(states[0]);
};

const task2 = () => {
  const valves = lines.reduce(
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

  let minutesLeft = 26;
  const state = {
    valves,
    positionA: "AA",
    positionB: "AA",
    minute: 30,
    totReleased: 0,
    pathA: ["AA"],
    pathB: ["AA"],
  };
  let states = [state];

  while (minutesLeft > 0) {
    // Only keep top 50 states
    states.sort((a, b) => b.totReleased - a.totReleased);
    states = states.slice(0, 30850);

    const newStates2 = [];
    for (const currentState of states) {
      const newStates = [];

      // Release pressure
      for (const valve of Object.values(currentState.valves)) {
        if (valve.isOpen) {
          currentState.totReleased = currentState.totReleased + valve.rate;
        }
      }

      // Position A
      const currentValve = currentState.valves[currentState.positionA];
      const connections = currentValve.connections;

      // Open valve
      if (!currentValve.isOpen && currentValve.rate > 0) {
        const newValves = { ...currentState.valves };
        newValves[currentState.positionA] = { ...currentValve, isOpen: true };
        newStates.push({
          valves: newValves,
          positionA: currentState.positionA,
          positionB: currentState.positionB,
          minute: currentState.minute - 1,
          totReleased: currentState.totReleased,
          pathA: [...currentState.pathA, currentState.positionA],
          pathB: currentState.pathB,
        });
      }

      // Go to connections
      for (const connection of connections) {
        // Go to connection
        newStates.push({
          valves: currentState.valves,
          positionA: connection,
          positionB: currentState.positionB,
          minute: currentState.minute - 1,
          totReleased: currentState.totReleased,
          pathA: [...currentState.pathA, connection],
          pathB: currentState.pathB,
        });
      }

      // Position B
      for (const newState of newStates) {
        const currentValve = newState.valves[newState.positionB];
        const connections = currentValve.connections;

        // Open valve
        if (!currentValve.isOpen && currentValve.rate > 0) {
          const newValves = { ...newState.valves };
          newValves[newState.positionB] = { ...currentValve, isOpen: true };
          newStates2.push({
            valves: newValves,
            positionA: newState.positionA,
            positionB: newState.positionB,
            minute: newState.minute,
            totReleased: newState.totReleased,
            pathA: newState.pathA,
            pathB: [...newState.pathB, newState.positionB],
          });
        }

        // Go to connections
        for (const connection of connections) {
          // Go to connection
          newStates2.push({
            valves: newState.valves,
            positionA: newState.positionA,
            positionB: connection,
            minute: newState.minute,
            totReleased: newState.totReleased,
            pathA: newState.pathA,
            pathB: [...newState.pathB, connection],
          });
        }
      }
    }
    states = newStates2;
    minutesLeft--;
  }

  states.sort((a, b) => b.totReleased - a.totReleased);
  console.log(states[0]);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
