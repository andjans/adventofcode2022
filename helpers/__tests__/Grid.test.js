import { Grid } from "../Grid.js";
import { EmptyPoint } from "../Point.js";

describe("Grid", () => {
  describe("when creating from constructor", () => {
    test("contains correct points for default arguments", () => {
      const grid = new Grid(5, 5);
      expect(grid.getAllNonEmpty().length).toBe(0);
      expect(grid.pointAt(2, 3).type).toBe(" ");
      expect(grid.pointAt(2, 3)).toBeInstanceOf(EmptyPoint);
      expect(grid.offsetX).toBe(0);
      expect(grid.offsetY).toBe(0);
      expect(grid.nColumns).toBe(5);
      expect(grid.nRows).toBe(5);
      expect(grid.nTotalPoints).toBe(25);
    });

    test("contains correct points when arguments is provided", () => {
      const grid = new Grid(5, 5, ".", 2, 3);
      expect(grid.getAllNonEmpty().length).toBe(0);
      expect(grid.pointAt(-2, -3).type).toBe(".");
      expect(grid.pointAt(-2, -3)).toBeInstanceOf(EmptyPoint);
      expect(grid.pointAt(2, 1).type).toBe(".");
      expect(grid.pointAt(2, 1)).toBeInstanceOf(EmptyPoint);
      expect(grid.offsetX).toBe(2);
      expect(grid.offsetY).toBe(3);
      expect(grid.nColumns).toBe(5);
      expect(grid.nRows).toBe(5);
    });
  });

  describe("when creating from array of strings", () => {
    test("contains correct points for default arguments", () => {
      const grid = Grid.createFromArrayOfStrings(["abc", "de", "fgh"]);
      expect(grid.getAllNonEmpty().length).toBe(8);
      expect(grid.nTotalPoints).toBe(9);
      expect(grid.pointAt(2, 0).type).toBe("h");
      expect(grid.pointAt(2, 1).type).toBe(" ");
      expect(grid.pointAt(2, 1)).toBeInstanceOf(EmptyPoint);
      expect(grid.pointAt(0, 2).type).toBe("a");
      expect(grid.offsetX).toBe(0);
      expect(grid.offsetY).toBe(0);
      expect(grid.nColumns).toBe(3);
      expect(grid.nRows).toBe(3);
    });

    test("contains correct points when empty type is specified", () => {
      const grid = Grid.createFromArrayOfStrings(["abc", "def", "ghij"], ".");
      expect(grid.getAllNonEmpty().length).toBe(10);
      expect(grid.nTotalPoints).toBe(12);
      expect(grid.pointAt(2, 0).type).toBe("i");
      expect(grid.pointAt(3, 2).type).toBe(".");
      expect(grid.pointAt(3, 2)).toBeInstanceOf(EmptyPoint);
      expect(grid.nColumns).toBe(4);
      expect(grid.nRows).toBe(3);
    });
  });

  describe("when creating from array of arrays", () => {
    test("contains correct points when types are numbers", () => {
      const grid = Grid.createFromArrayOfArrays([
        [1, 2],
        [3, 4],
      ]);
      expect(grid.getAllNonEmpty().length).toBe(4);
      expect(grid.pointAt(1, 0).type).toBe(4);
      expect(grid.pointAt(0, 1).type).toBe(1);
      expect(grid.offsetX).toBe(0);
      expect(grid.offsetY).toBe(0);
      expect(grid.nColumns).toBe(2);
      expect(grid.nRows).toBe(2);
    });
  });

  describe("when creating an offset grid from array of points", () => {
    let grid;
    beforeEach(() => {
      grid = Grid.createFromArrayOfPoints(
        [
          [-5, -5, "x"],
          [-2, -3, "a"],
          [3, 2, "b"],
        ],
        "."
      );
    });

    test("contains correct points", () => {
      expect(grid.getAllNonEmpty().length).toBe(3);
      expect(grid.pointAt(-2, -3).type).toBe("a");
      expect(grid.pointAt(-2, -3).x).toBe(-2);
      expect(grid.pointAt(-2, -3).y).toBe(-3);
      expect(grid.pointAt(-2, -3).xy).toBe("-2,-3");
      expect(grid.pointAt(3, 2).type).toBe("b");
      expect(grid.pointAt(3, 2).x).toBe(3);
      expect(grid.pointAt(3, 2).y).toBe(2);
      expect(grid.pointAt(3, 2).xy).toBe("3,2");
      expect(grid.nColumns).toBe(9);
      expect(grid.nRows).toBe(8);
      expect(grid.nTotalPoints).toBe(72);
    });

    test("filters the grid with specified filter function", () => {
      const points = grid.filter((point) => point.x > 2 && point.y < 1);
      expect(points.length).toBe(6);
      expect(points.every((p) => p.type === ".")).toBeTruthy();
      expect(points.every((p) => p.x === 3)).toBeTruthy();
      expect(points.some((p) => p.y === -5)).toBeTruthy();
    });

    test("filters the grid to return evey other point diagonally", () => {
      let points = grid.filterOnLine(2, 2);
      expect(points.length).toBe(4);
      expect(points.some((p) => p.y === -5 && p.x === -5)).toBeTruthy();
      expect(points.some((p) => p.y === -3 && p.x === -3)).toBeTruthy();
      expect(points.some((p) => p.y === -4 && p.x === -4)).toBeFalsy();
      points = grid.filterOnLine(1, 1, -3, -4);
      expect(points.length).toBe(7);
      expect(points.some((p) => p.y === -4 && p.x === -3)).toBeTruthy();
      expect(points.some((p) => p.y === -3 && p.x === -2)).toBeTruthy();
      expect(points.some((p) => p.y === -5 && p.x === -4)).toBeFalsy();
      points = grid.filterOnLine(-1, 0, 0, 0);
      expect(points.length).toBe(6);
      expect(points[0].xy).toBe("0,0");
      expect(points[5].xy).toBe("-5,0");
      expect(points.some((p) => p.y === 1 && p.x === 0)).toBeFalsy();
    });

    test("filters the grid to return points in the specified area", () => {
      let points = grid.filterInArea(1, 1, [-5, -5], [0, 0]);
      expect(points.length).toBe(36);
      expect(points[0].y === -5 && points[0].x === -5).toBeTruthy();
      expect(points[35].y === 0 && points[35].x === 0).toBeTruthy();
      expect(points.some((p) => p.y === 1 && p.x === 1)).toBeFalsy();
      points = grid.filterInArea(-1, -1, [1, -4]);
      expect(points.length).toBe(14);
      expect(points[0].y === -4 && points[0].x === 1).toBeTruthy();
      expect(points[13].y === -5 && points[13].x === -5).toBeTruthy();
      expect(points.some((p) => p.y === 0 && p.x === 0)).toBeFalsy();
    });

    test("returns sub-grid correctly", () => {
      grid = grid.toSubGrid(grid.pointAt(-2, -3));
      expect(grid.getAllNonEmpty().length).toBe(2);
      expect(grid.pointAt(-2, -3).type).toBe("a");
      expect(grid.pointAt(3, 2).type).toBe("b");
      expect(grid.nColumns).toBe(6);
      expect(grid.nRows).toBe(6);
      grid = grid.toSubGrid(grid.pointAt(-1, -1), grid.pointAt(1, 1));
      expect(grid.getAllNonEmpty().length).toBe(0);
      expect(grid.nColumns).toBe(3);
      expect(grid.nRows).toBe(3);
    });

    test("removes specified points", () => {
      grid = grid.removeAll([grid.pointAt(-2, -3), grid.pointAt(1, 1)]);
      expect(grid.getAllNonEmpty().length).toBe(2);
      expect(grid.pointAt(-2, -3).type).toBe(".");
      expect(grid.pointAt(-2, -3)).toBeInstanceOf(EmptyPoint);
      expect(grid.nColumns).toBe(9);
      expect(grid.nRows).toBe(8);
      expect(grid.nTotalPoints).toBe(72);
    });

    test("copies the grid into a new grid", () => {
      const grid2 = grid.copy();
      grid2.setPointAt(1, 1, "new");
      expect(grid.getAllNonEmpty().length).toBe(3);
      expect(grid2.getAllNonEmpty().length).toBe(4);
      expect(grid.pointAt(1, 1).type).toBe(".");
      expect(grid.pointAt(1, 1)).toBeInstanceOf(EmptyPoint);
      expect(grid2.pointAt(1, 1).type).toBe("new");
      expect(grid2.pointAt(1, 1)).not.toBeInstanceOf(EmptyPoint);
      expect(grid2.pointAt(0, 0)).toBeInstanceOf(EmptyPoint);
      expect(grid.nColumns).toBe(9);
      expect(grid.nRows).toBe(8);
      expect(grid.nTotalPoints).toBe(72);
    });

    test("returns true when grid is same", () => {
      const copy = grid.copy();
      expect(grid.same(copy)).toBe(true);
      copy.setPointAt(0, 0, "change");
      expect(grid.same(copy)).toBe(false);
      expect(grid.same(grid.toSubGrid(grid.pointAt(-5, -5)))).toBe(true);
      expect(grid.same(grid.toSubGrid(grid.pointAt(0, 0)))).toBe(false);
    });
  });
});
