import { Point, EmptyPoint } from "./Point.js";
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
  static createFromArrayOfPoints(points, emptyType, nColumns = 0, nRows = 0) {
    const [maxX, maxY] = points.maxValues();
    const [minX, minY] = points.minValues();
    const [offsetX, offsetY] = [minX < 0 ? minX * -1 : 0, minY < 0 ? minY * -1 : 0];
    const grid = new Grid(Math.max(nColumns, maxX + offsetX + 1), Math.max(nRows, maxY + offsetY + 1), emptyType);
    points.forEach((point) => {
      if (point[3]) grid.pointAt(point[0] + offsetX, point[1] + offsetY).type = point[2];
      else grid.setPointAt(point[0] + offsetX, point[1] + offsetY, point[2]);
    });
    return grid;
  }

  constructor(nColumns, nRows, emptyType) {
    this._points = [];
    for (let column = 0; column < nColumns; column++) {
      this._points.push([]);
      for (let row = 0; row < nRows; row++) {
        this._points[column].push(new EmptyPoint(column, row, emptyType));
      }
    }
  }

  get nColumns() {
    return this._points.length;
  }

  get nRows() {
    return this._points[0].length;
  }

  get nTotalPoints() {
    return this.nColumns * this.nRows;
  }

  pointAt(x, y) {
    return this._points[x][y];
  }

  allPointsX(x) {
    return this._points[x];
  }

  allPointsY(y) {
    return this._points.transpose()[y];
  }

  /**
   * Returns a new Grid with the given list of points removed
   */
  removeAll(points) {
    return Grid.createFromArrayOfPoints(this._points.except(points).map((point) => [point.x, point.y, point.type, point instanceof EmptyPoint]));
  }

  /**
   * Returns a new Grid with the given list of points set to empty points
   */
  clearAll(points) {
    return Grid.createFromArrayOfPoints(this._points.map((point) => [point.x, point.y, undefined, points.includes(point)]));
  }

  /**
   * Returns a list of filtered points based on the given filter function.
   * Filter function: (point: Point, index, array: Point[]) => boolean
   */
  filter(fn) {
    return this._points.filter(fn);
  }

  /**
   * Returns a list of filtered points by the input steps and starting positions.
   * Example:
   * filterByStep(2, -2, 6, 7)
   * This will start at point [6,7] and step +2 steps on the horizontal line, and -2 steps on the vertical line for
   * each new point. This means that the returned list of points will become:
   * [[6,7],[8,5],[10,3],[12,1]]
   *
   * Note that any of the starting positions can be omitted. The default starting point is [0,0].
   * A 5th argument can be provided to set if the starting point should be included or not (defaults to true).
   */
  filterByStep(stepX, stepY, startX = 0, startY = 0, includeStart = true) {
    const filteredPoints = [];
    let x = startX,
      y = startY;
    while (true) {
      if (x !== startX || y !== startY || includeStart) {
        filteredPoints.push(this._points[x][y]);
      }
      x += stepX;
      y += stepY;
      if (x >= this.nColumns || x < 0 || y >= this.nRows || y < 0) break;
    }
    return filteredPoints;
  }

  /**
   * Same as filterByStep, but this will step x and y individually, making it include every point covered by the steps.
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
  filterByMultipleStep(stepX, stepY, [startX, startY] = [0, 0], [stopX, stopY] = [], includeStart = true) {
    if (stepX === 0 || stepY === 0) throw new Error("filterByMultipleStep: steps cannot be 0");

    const shouldContinueX = (x) => {
      if (stepX < 0) {
        return x >= (stopX || 0);
      } else {
        return x <= (stopX || this.nColumns - 1);
      }
    };
    const shouldContinueY = (y) => {
      if (stepY < 0) {
        return y >= (stopY || 0);
      } else {
        return y <= (stopY || this.nRows - 1);
      }
    };

    const filteredPoints = [];
    for (let x = startX; shouldContinueX(x); x += stepX) {
      for (let y = startY; shouldContinueY(y); y += stepY) {
        if (x === startX && y === startY && !includeStart) {
          continue;
        }
        filteredPoints.push(this._points[x][y]);
      }
    }
    return filteredPoints;
  }

  setPointAt(x, y, type) {
    this._points[x][y] = new Point(x, y, type);
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

  /**
   * Transposes the grid, example:
   * ["abcd", "efgh"] will become ["ea","fb","gc","hd"]
   */
  transpose() {
    return Grid.createFromArrayOfStrings(this._points.joinSubArraysBy(""));
  }

  /**
   * Creates a sub-grid from the given points. Note that point2 can be omitted, it will then be [maxX, maxY].
   */
  toSubGrid(point, point2) {
    if (!point2) point2 = this._points[this._points.length - 1][this._points[0].length - 1];
    const subGrid = [];
    for (let x = point.x; x <= point2.x; x++) {
      for (let y = point.y; y <= point2.y; y++) {
        subGrid.push([x - point.x, y - point.y, this._points[x][y].type, this._points[x][y] instanceof EmptyPoint]);
      }
    }
    return Grid.createFromArrayOfPoints(subGrid);
  }

  switch(point, point2) {
    this._points[point.x][point.y] = point2 instanceof EmptyPoint ? new EmptyPoint(point.x, point.y, point2.type) : new Point(point.x, point.y, point2.type);
    this._points[point2.x][point2.y] = point instanceof EmptyPoint ? new EmptyPoint(point2.x, point2.y, point.type) : new Point(point2.x, point2.y, point.type);
  }

  print(spacing = " ") {
    this._points
      .transpose()
      .reverse()
      .forEach((column) => {
        console.log(column.join(spacing));
      });
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
