import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const parse = (blueprintLine) => {
  const robots = blueprintLine
    .split(": ")[1]
    .split(". ")
    .map((robot) => {
      const robotParts = robot.trim().split(" ");
      const costs = robot
        .split("costs ")[1]
        .split(" and ")
        .map((cost) => {
          return {
            price: Number(cost.split(" ")[0]),
            type: cost.split(" ")[1].replaceAll(".", ""),
          };
        });
      return {
        type: robotParts[1],
        costs,
      };
    });
  return {
    id: blueprintLine.getNumbers()[0],
    robots,
  };
};

// helper function to check if we can afford a particular robot
function canAffordRobot(robot, storage) {
  return robot.costs.every((cost) => storage[cost.type] >= cost.price);
}

// helper function to calculate the maximum cost of a particular robot
function getMaxCost(robot, robots) {
  return robots
    .map((r) => r.costs)
    .flat()
    .reduce((max, cost) => {
      return cost.type === robot.type ? Math.max(max, cost.price) : max;
    }, 0);
}

// helper function to produce resources for all robots in the inventory
function produceResources(inventory, storage) {
  Object.entries(inventory).forEach(([type, count]) => {
    storage[type] = (storage[type] || 0) + count;
  });
  return storage;
}

function maximizeGeodes(blueprint, rounds) {
  const inventory = { ore: 1, clay: 0, obsidian: 0, geode: 0 }; // start with 1 robot of type "ore"
  const storage = { ore: 0, clay: 0, obsidian: 0, geode: 0 }; // start with no resources in storage
  const memo = {}; // store previously calculated sub-problems
  const geodeRobot = blueprint.robots.find((r) => r.type === "geode");

  // calculate the maximum cost for each type of robot
  const maxCosts = blueprint.robots.reduce((costs, robot) => {
    costs[robot.type] = getMaxCost(robot, blueprint.robots);
    return costs;
  }, {});

  function traverse(roundsLeft, inventory, storage, skippedRobots = []) {
    const key =
      "" + roundsLeft + Object.values(inventory).join("") + Object.values(storage).join(""); // create a unique key for the subproblem
    if (memo[key]) {
      // check if the subproblem has been previously calculated
      return memo[key];
    }
    if (roundsLeft === 0) {
      // base case: we have reached the end of the simulation
      return storage.geode || 0;
    }

    let maxGeodes = 0;

    // try buying each robot
    // Always buy geode if possible
    if (canAffordRobot(geodeRobot, storage) && roundsLeft > 1) {
      const newInventory = { ...inventory };
      let newStorage = { ...storage };

      // perform the produce phase for all robots in the inventory
      newStorage = produceResources(newInventory, newStorage);

      // perform the buy phase
      newInventory[geodeRobot.type] = (newInventory[geodeRobot.type] || 0) + 1;
      geodeRobot.costs.forEach((cost) => {
        newStorage[cost.type] -= cost.price;
      });

      // recursive call to compute the maximum number of geodes we can produce
      // with the updated inventory and storage
      const geodes = traverse(roundsLeft - 1, newInventory, newStorage);
      // update the maximum number of geodes if necessary
      if (geodes >= maxGeodes) {
        maxGeodes = geodes;
      }
    } else {
      blueprint.robots.forEach((robot) => {
        if (
          robot.type === geodeRobot.type ||
          roundsLeft === 1 ||
          skippedRobots.includes(robot.type) ||
          !canAffordRobot(robot, storage)
        ) {
          return;
        }

        const newInventory = { ...inventory };
        let newStorage = { ...storage };

        // check if we already have enough robots to produce the maximum number of resources
        const maxCost = maxCosts[robot.type];
        if (newInventory[robot.type] < maxCost) {
          // perform the produce phase for all robots in the inventory
          newStorage = produceResources(newInventory, newStorage);

          // perform the buy phase
          newInventory[robot.type] = (newInventory[robot.type] || 0) + 1;
          robot.costs.forEach((cost) => {
            newStorage[cost.type] -= cost.price;
          });

          // recursive call to compute the maximum number of geodes we can produce
          // with the updated inventory and storage
          const geodes = traverse(roundsLeft - 1, newInventory, newStorage);
          // update the maximum number of geodes if necessary
          if (geodes >= maxGeodes) {
            maxGeodes = geodes;
          }
        }
      });

      // If I have no clay or obsidian robots, and I can afford a clay or ore robot, there is no need to not buy a robot
      if (
        inventory.clay === 0 &&
        inventory.obsidian === 0 &&
        canAffordRobot(
          blueprint.robots.find((r) => r.type === "clay"),
          storage
        ) &&
        canAffordRobot(
          blueprint.robots.find((r) => r.type === "ore"),
          storage
        )
      ) {
        memo[key] = maxGeodes;
        return maxGeodes;
      }

      // try not buying any robots
      let newStorage = { ...storage };
      newStorage = produceResources(inventory, newStorage);
      const newSkippedRobots = blueprint.robots
        .filter((r) => canAffordRobot(r, storage))
        .map((r) => r.type);
      const geodes = traverse(roundsLeft - 1, inventory, newStorage, newSkippedRobots);
      if (geodes >= maxGeodes) {
        maxGeodes = geodes;
      }
    }

    // store the result in the memoization table
    memo[key] = maxGeodes;
    return maxGeodes;
  }

  return traverse(rounds, inventory, storage);
}

const task1 = () => {
  const t1 = new Date().getTime();
  const blueprints = lines.map((b) => parse(b));
  console.log(
    blueprints
      .map((blueprint) => {
        const result = maximizeGeodes(blueprint, 24);
        console.log("Blueprint " + blueprint.id + ": " + result);
        return result * blueprint.id;
      })
      .sum()
  );
  console.log((new Date().getTime() - t1) / 1000);
};

const task2 = () => {
  const t1 = new Date().getTime();
  const blueprints = lines.map((b) => parse(b));
  console.log(
    blueprints
      .slice(0, 3)
      .map((blueprint) => {
        const result = maximizeGeodes(blueprint, 32);
        console.log("Blueprint " + blueprint.id + ": " + result);
        return result;
      })
      .product()
  );
  console.log((new Date().getTime() - t1) / 1000);
};

console.log("---- task 1 ----");
//task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
