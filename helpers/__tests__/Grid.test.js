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
  });
});
