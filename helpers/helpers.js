import "./stringUtils.js";
import "./arrayUtils.js";
import "./numberUtils.js";

export function djikstra(all, start, ends, options = {}) {
  const { getCost = (a, b) => 1, checkIfPossible = (a, b) => true } = options;
  let current = { node: start, cost: 0, parent: null };
  const checkedNodes = {
    [start.value]: current,
  };
  const visited = [];
  const unvisited = all.map((node) => node.value);

  // Loop until the end point has been selected as current point, meaning it has the lowest cost
  // of the unvisited points. Then we know that the current point contains the shortest path.
  while (!ends.includes(current.node.value)) {
    // Check cost to all neighbours to current point
    current.node.connections.forEach((connection) => {
      // Only check point if possible and not yet visited
      if (checkIfPossible(current.node, connection) && !visited.includes(connection)) {
        const costToNode = current.cost + getCost(current.node, connection);
        // If point has not yet been checked, or if the current cost is lower...
        // ...then set the checked point to this point
        if (!checkedNodes[connection] || costToNode < checkedNodes[connection].cost) {
          checkedNodes[connection] = {
            node: all.find((node) => node.value === connection),
            cost: costToNode,
            parent: current.node.value,
          };
        }
      }
    });
    visited.push(current.node.value);
    unvisited.splice(unvisited.indexOf(current.node.value), 1);

    // Find the checked point, with the lowest cost, that has not yet been visited
    // Set that point to be used as current point next iteration
    current = unvisited.reduce(
      (lowest, value) =>
        !lowest || (!!checkedNodes[value] && checkedNodes[value].cost < lowest.cost)
          ? checkedNodes[value]
          : lowest,
      null
    );

    if (!current) {
      // In case no current point could be found, then there is no possible path between start and end
      //throw new Error("No path found");
      //console.log("No path found from " + start.value + " to " + ends);
      return undefined;
    }
  }

  // To get the exact path from start to end we have to backtrace from current point (end)
  let nodeOnPath = current;
  const path = [current];
  while (nodeOnPath.node.value !== start.value) {
    path.push(checkedNodes[nodeOnPath.parent]);
    nodeOnPath = checkedNodes[nodeOnPath.parent];
  }
  return { path: path.map((p) => p.node).reverse(), cost: current.cost, end: current.node };
}
