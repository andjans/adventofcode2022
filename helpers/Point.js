export const P = (x, y, type) => new Point(x, y, type);

export const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export const diagonalDirections = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

export class Point {
  set type(value) {
    this._type = value;
  }

  get type() {
    return this._type;
  }

  get y() {
    return this._y;
  }

  get x() {
    return this._x;
  }

  get xy() {
    return this._x + "," + this._y;
  }

  constructor(x, y, type = "x") {
    this._x = x;
    this._y = y;
    this._type = type;
  }

  distanceTo(other, diagonalAllowed = false) {
    const distX = Math.abs(this.x - other.x);
    const distY = Math.abs(this.y - other.y);
    if (!diagonalAllowed) return distX + distY;
    return Math.abs(distX - distY) + Math.min(distX, distY);
  }

  up() {
    return this.offset([0, 1]);
  }

  down() {
    return this.offset([0, -1]);
  }

  left() {
    return this.offset([-1, 0]);
  }

  right() {
    return this.offset([1, 0]);
  }

  /**
   * Get a new point (of same type) with the given offset.
   * For example if this point is [1,2] and the offset is [2, -1] the result will be [3, 1]
   */
  offset(offset) {
    return new Point(this.x + offset[0], this.y + offset[1], this.type);
  }

  neighbours(includeDiagonal = false, includeSelf = false) {
    const points = [];
    directions.forEach((dir) => points.push(this.offset(dir)));
    if (includeDiagonal) diagonalDirections.forEach((dir) => points.push(this.offset(dir)));
    if (includeSelf) points.push(this.offset([0, 0]));
    return points;
  }

  toString() {
    if (Array.isArray(this._type)) {
      if (this._type.length === 1) return this._type[0];
      return this._type.length;
    }
    return this._type;
  }
}

export class EmptyPoint extends Point {
  constructor(x, y, type = " ") {
    super(x, y, type);
  }
}
