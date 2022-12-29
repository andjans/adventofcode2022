import { Point, EmptyPoint, directions, diagonalDirections } from "./Point.js";
import "./arrayUtils.js";

export class Grid {
  /**
   * 3x3 grid example:
   * ["abc",
   * "cde",
   * "fgh"]
   */
  static createFromArrayOfStrings(lines, emptyType) {
    return Grid.createFromArrayOfArrays(lines.splitEachElementBy(""), emptyType);
  }

  /**
   * 3x3 grid example:
   * [["a","b","c"],
   * ["d","e","f"],
   * ["g","h","i"]]
   *
   * or numbers:
   * [[0,1,2],
   * [3,4,5],
   * [6,7,8]]
   */
  static createFromArrayOfArrays(array, emptyType) {
    const grid = new Grid(array.map((line) => line.length).max(), array.length, emptyType);
    array.reverse().forEach((line, y) => {
      line.forEach((value, x) => {
        grid.setPointAt(x, y, value);
      });
    });
    return grid;
  }

  /**
   * 2x2 grid example:
   * [[0,0,a],[0,1,b],[1,0,c],[1,1,d]]
   * The function works without the types as well, example:
   * [[0,0],[0,1],[1,0],[1,1]]
   * Note that it also works without specifying all points in the array. This also creates a 2x2 grid:
   * [[0,0],[1,1]]
   *
   * A 4th value can be added to each point to indicate if it should be an empty point instance:
   * [1,3,x,true]
   *
   * Note that nColumns and nRows can be passed in if the grid should be larger than max of the supplied points.
   */
  static createFromArrayOfPoints(points, emptyType = " ", nColumns = 0, nRows = 0) {
    const [maxX, maxY] = points.maxValues();
    const [minX, minY] = points.minValues();
    const [offsetX, offsetY] = [minX < 0 ? minX * -1 : 0, minY < 0 ? minY * -1 : 0];
    const grid = new Grid(
      Math.max(nColumns, maxX + offsetX + 1),
      Math.max(nRows, maxY + offsetY + 1),
      emptyType,
      offsetX,
      offsetY
    );
    points.forEach((point) => {
      if (point[3]) grid.pointAt(point[0], point[1]).type = point[2];
      else grid.setPointAt(point[0], point[1], point[2]);
    });
    return grid;
  }

  static createFromArrayOfRealPoints(points, emptyType = " ", nColumns = 0, nRows = 0) {
    return Grid.createFromArrayOfPoints(
      points.map((point) => [point.x, point.y, point.type, point instanceof EmptyPoint]),
      emptyType,
      nColumns,
      nRows
    );
  }

  constructor(nColumns, nRows, emptyType = " ", offsetX = 0, offsetY = 0) {
    this._points = [];
    for (let column = 0; column < nColumns; column++) {
      this._points.push([]);
      for (let row = 0; row < nRows; row++) {
        this._points[column].push(new EmptyPoint(column - offsetX, row - offsetY, emptyType));
      }
    }
    this._emptyType = emptyType;
    this._offsetX = offsetX;
    this._offsetY = offsetY;
  }

  get nColumns() {
    return this._points.length;
  }

  get nRows() {
    return this._points[0].length;
  }

  get emptyType() {
    return this._emptyType;
  }

  get offsetX() {
    return this._offsetX;
  }

  get offsetY() {
    return this._offsetY;
  }

  get nTotalPoints() {
    return this.nColumns * this.nRows;
  }

  pointAt(x, y) {
    return this._points[x + this._offsetX][y + this._offsetY];
  }

  allPointsX(x) {
    return this._points[x + this._offsetX];
  }

  allPointsY(y) {
    return this._points.transpose()[y + this._offsetY];
  }

  adjacentPoints(point, includeDiagonal = false) {
    const adjacentDirections = includeDiagonal
      ? [...directions, ...diagonalDirections]
      : [...directions];
    return adjacentDirections
      .filter((dir) => {
        const newX = point.x + dir[0];
        const newY = point.y + dir[1];
        return (
          newX + this.offsetX >= 0 &&
          newX + this.offsetX < this.nColumns &&
          newY + this.offsetY >= 0 &&
          newY + this.offsetY < this.nRows
        );
      })
      .map((dir) => {
        return this.pointAt(point.x + dir[0], point.y + dir[1]);
      });
  }

  /**
   * Returns a new Grid with the given list of points removed.
   * Note that if the specified points are not covering a whole
   * row or column, they will be turned into EmptyPoints.
   */
  removeAll(points) {
    return Grid.createFromArrayOfPoints(
      this._points
        .flat()
        .except(points)
        .map((point) => [point.x, point.y, point.type, point instanceof EmptyPoint]),
      this._emptyType
    );
  }

  /**
   * Returns a copy of this grid
   */
  copy() {
    return this.removeAll([]);
  }

  /**
   * Returns a list of filtered points based on the given filter function.
   * Filter function: (point: Point, index, array: Point[]) => boolean
   */
  filter(fn) {
    return this._points.flat().filter(fn);
  }

  /**
   * Returns a list of filtered points by the input steps and starting
   * positions. Useful when you want points in a line returned.
   *
   * Example:
   * filterByStep(2, -2, 6, 7)
   * This will start at point [6,7] and step +2 steps on the horizontal line, and -2 steps on the vertical line for
   * each new point. This means that the returned list of points will become:
   * [[6,7],[8,5],[10,3],[12,1]]
   *
   * Note that any of the starting positions can be omitted. The default starting point is [0,0].
   * A 5th argument can be provided to set if the starting point should be included or not (defaults to true).
   */
  filterOnLine(
    stepX,
    stepY,
    startX = 0 - this.offsetX,
    startY = 0 - this.offsetY,
    includeStart = true,
    includeEmpty = true
  ) {
    const filteredPoints = [];
    let x = startX + this.offsetX,
      y = startY + this.offsetY;
    while (true) {
      if (x !== startX || y !== startY || includeStart) {
        if (includeEmpty || !(this._points[x][y] instanceof EmptyPoint))
          filteredPoints.push(this._points[x][y]);
      }
      x += stepX;
      y += stepY;
      if (x >= this.nColumns || x < 0 || y >= this.nRows || y < 0) break;
    }
    return filteredPoints;
  }

  /**
   * Same as filterByStep, but this will step x and y individually, making it
   * include every point covered by the steps. Useful when you want points in an
   * area returned.
   *
   * For example:
   * filterByMultipleStep(1,1,[3,4])
   * This will return all points (like a sub-grid) starting at point [3,4] ending at point [maxX, maxY]
   *
   * A stop point can be provided as well, for example:
   * filterByMultipleStep(1,1,[3,4],[9,8])
   * This will stop at point [9,8] instead of [maxX, maxY]
   *
   * Note that the steps must be a positive or negative number, they cannot be 0.
   */
  filterInArea(
    stepX,
    stepY,
    [startX, startY] = [0 - this.offsetX, 0 - this.offsetY],
    [stopX, stopY] = [],
    includeStart = true
  ) {
    if (stepX === 0 || stepY === 0) throw new Error("filterByMultipleStep: steps cannot be 0");

    const shouldContinueX = (x) => {
      if (stepX < 0) {
        return x >= (stopX + this.offsetX || 0);
      } else {
        return x <= (stopX + this.offsetX || this.nColumns - 1);
      }
    };
    const shouldContinueY = (y) => {
      if (stepY < 0) {
        return y >= (stopY + this.offsetY || 0);
      } else {
        return y <= (stopY + this.offsetY || this.nRows - 1);
      }
    };

    const filteredPoints = [];
    for (let x = startX + this.offsetX; shouldContinueX(x); x += stepX) {
      for (let y = startY + this.offsetY; shouldContinueY(y); y += stepY) {
        if (x === startX + this.offsetX && y === startY + this.offsetY && !includeStart) {
          continue;
        }
        filteredPoints.push(this._points[x][y]);
      }
    }
    return filteredPoints;
  }

  // TODO Remove row & remove column

  // TODO Flip and mirror

  setPointAt(x, y, type) {
    if (
      this._points[x + this._offsetX] !== undefined &&
      this._points[x + this._offsetX][y + this._offsetY] !== undefined
    ) {
      this._points[x + this._offsetX][y + this._offsetY] = new Point(x, y, type);
    }
  }

  getAllWithType(type) {
    return this._points.flat().filter((point) => point.type === type);
  }

  getAllNonEmpty() {
    return this._points.flat().filter((point) => !(point instanceof EmptyPoint));
  }

  findClosestWithSameType(point, diagonalAllowed = false) {
    return this.findClosestWithType(point, point.type, diagonalAllowed);
  }

  findClosestWithType(point, type, diagonalAllowed = false) {
    return this.getAllWithType(type).reduce((closest, current) => {
      if (current.xy === point.xy) return closest;
      const distance = current.distanceTo(point, diagonalAllowed);
      if (!closest || distance < closest[1]) return [current, distance];
      return closest;
    })[0];
  }

  neighbours(point, includeDiagonal, includeSelf) {
    return this._points[point.x][point.y]
      .neighbours(includeDiagonal, includeSelf)
      .filter(
        (p) => p.x >= 0 && p.y >= 0 && p.x < this._points.length && p.y < this._points[p.x].length
      )
      .map((p) => this.pointAt(p.x, p.y));
  }

  /**
   * Transposes the grid, example:
   * ["abcd", "efgh"] will become ["ea","fb","gc","hd"]
   */
  transpose() {
    return Grid.createFromArrayOfStrings(this._points.joinSubArraysBy(""));
  }

  /**
   * Creates a sub-grid from the given points. Note that toPoint can be omitted, it will then be [maxX, maxY].
   */
  toSubGrid(fromPoint, toPoint = null, keepXY = true) {
    const [maxX, maxY] = toPoint
      ? [toPoint.x + this._offsetX, toPoint.y + this._offsetY]
      : [this._points.length - 1, this._points[0].length - 1];
    const [minX, minY] = [fromPoint.x + this._offsetX, fromPoint.y + this._offsetY];

    const subGrid = [];
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        subGrid.push([
          keepXY ? fromPoint.x + (x - minX) : x - minX,
          keepXY ? fromPoint.y + (y - minY) : y - minY,
          this._points[x][y].type,
          this._points[x][y] instanceof EmptyPoint,
        ]);
      }
    }
    return Grid.createFromArrayOfPoints(subGrid, this.emptyType);
  }

  switch(point, point2) {
    this._points[point.x][point.y] =
      point2 instanceof EmptyPoint
        ? new EmptyPoint(point.x, point.y, point2.type)
        : new Point(point.x, point.y, point2.type);
    this._points[point2.x][point2.y] =
      point instanceof EmptyPoint
        ? new EmptyPoint(point2.x, point2.y, point.type)
        : new Point(point2.x, point2.y, point.type);
  }

  same(grid) {
    if (this.nRows !== grid.nRows || this.nColumns !== grid.nColumns) return false;
    if (this.offsetX !== grid.offsetX || this.offsetY !== grid.offsetY) return false;
    for (let x = 0; x < this.nColumns; x++) {
      for (let y = 0; y < this.nRows; y++) {
        const thisPoint = this._points[x][y];
        const otherPoint = grid.pointAt(x - this.offsetX, y - this.offsetY);
        if (thisPoint.xy !== otherPoint.xy) return false;
        if (thisPoint.type !== otherPoint.type) return false;
      }
    }
    return true;
  }

  print(spacing = " ") {
    //maxY
    this._points
      .transpose()
      .reverse()
      .forEach((column) => {
        console.log(column.join(spacing));
      });
    //minY
    //minX maxX
  }

  /**
   * Get the closest path from the start point to any of the end points. The return value will be an object
   * with the parameters `path` (array of all points along the closest path from start to finish), `end` (the end
   * point that had the shortest path), and `cost` (the total cost/distance from the start to finish).
   * The third argument is an options object that has the following optional properties:
   * - getCost: a function to calculate the cost/distance between two points
   * - checkIfPossible: a function to check if it is possible to go between two points
   * - allowDiagonalSearch: true if it should be possible to traverse diagonally (default `false`)
   */
  findClosestPath(startPoint, endPoints, options = {}) {
    const {
      getCost = (a, b) => 1,
      checkIfPossible = (a, b) => true,
      allowDiagonalSearch = false,
    } = options;
    let currentPoint = { point: startPoint, cost: 0, parent: null };
    const checkedPoints = {
      [startPoint.xy]: currentPoint,
    };
    const visited = [];
    const unvisited = this._points.flat().map((p) => p.xy);
    const endPointsXY = endPoints.map((p) => p.xy);

    // Loop until the end point has been selected as current point, meaning it has the lowest cost
    // of the unvisited points. Then we know that the current point contains the shortest path.
    while (!endPointsXY.includes(currentPoint.point.xy)) {
      // Check cost to all neighbours to current point
      this.neighbours(currentPoint.point, allowDiagonalSearch, false).forEach((point) => {
        // Only check point if possible and not yet visited
        if (checkIfPossible(currentPoint.point, point) && !visited.includes(point.xy)) {
          const costToPoint = currentPoint.cost + getCost(currentPoint.point, point);
          // If point has not yet been checked, or if the current cost is lower...
          // ...then set the checked point to this point
          if (!checkedPoints[point.xy] || costToPoint < checkedPoints[point.xy].cost) {
            checkedPoints[point.xy] = { point, cost: costToPoint, parent: currentPoint.point.xy };
          }
        }
      });
      visited.push(currentPoint.point.xy);
      unvisited.splice(unvisited.indexOf(currentPoint.point.xy), 1);

      // Find the checked point, with the lowest cost, that has not yet been visited
      // Set that point to be used as current point next iteration
      currentPoint = unvisited.reduce(
        (lowest, xy) =>
          !lowest || (!!checkedPoints[xy] && checkedPoints[xy].cost < lowest.cost)
            ? checkedPoints[xy]
            : lowest,
        null
      );

      if (!currentPoint) {
        // In case no current point could be found, then there is no possible path between start and end
        throw new Error("No path found");
      }
    }

    // To get the exact path from start to end we have to backtrace from current point (end)
    let pointOnPath = currentPoint;
    const path = [currentPoint];
    while (pointOnPath.point.xy !== startPoint.xy) {
      path.push(checkedPoints[pointOnPath.parent]);
      pointOnPath = checkedPoints[pointOnPath.parent];
    }
    return { path: path.reverse(), cost: currentPoint.cost, end: currentPoint.point };
  }

  toString() {
    let output = "";
    this._points
      .transpose()
      .reverse()
      .forEach((column) => {
        output += column.join(" ") + "\n";
      });
    return output;
  }
}
