Array.prototype.intersect = function (arr) {
  return this.filter((value) => arr.includes(value));
};

Array.prototype.except = function (arr) {
  return this.filter((value) => !arr.includes(value));
};

Array.prototype.toNumber = function () {
  return this.map((value) => {
    if (Array.isArray(value)) return value.toNumber();
    return Number(value);
  });
};

Array.prototype.sum = function () {
  return this.reduce((sum, value) => sum + value, 0);
};

Array.prototype.max = function () {
  return this.reduce((max, value) => (value > max ? value : max), 0);
};

Array.prototype.min = function () {
  return this.reduce((min, value) => (value < min ? value : min), Number.MAX_VALUE);
};

Array.prototype.count = function (element) {
  return this.filter((value) => value === element).length;
};

Array.prototype.everyNthElement = function (step, startIndex = 0) {
  return this.reduce((arrays, curr, index) => {
    if (index < startIndex) return arrays;
    if ((index - startIndex) % step === 0) {
      arrays.push(curr);
    }
    return arrays;
  }, []);
};

Array.prototype.splitByElement = function (element) {
  return this.reduce(
    (arrays, curr) => {
      if (curr === element) {
        arrays.push([]);
      } else {
        arrays[arrays.length - 1].push(curr);
      }
      return arrays;
    },
    [[]]
  );
};

Array.prototype.splitEachElementBy = function (value) {
  return this.reduce((arrays, curr) => {
    arrays.push(curr.split(value));
    return arrays;
  }, []);
};

Array.prototype.joinSubArraysBy = function (value) {
  return this.reduce((arrays, curr) => {
    arrays.push(curr.join(value));
    return arrays;
  }, []);
};

Array.prototype.splitEachNthElement = function (step) {
  return this.reduce((arrays, curr, index) => {
    if (index % step === 0) {
      arrays.push(this.slice(index, index + step));
    }
    return arrays;
  }, []);
};

Array.prototype.transpose = function () {
  const ret = [];
  this.forEach((element) => {
    element.forEach((value, index) => {
      if (ret[index] === undefined) ret[index] = [];
      ret[index].push(value);
    });
  });
  return ret;
};

Array.prototype.transposeStrings = function () {
  return this.map((value) => value.split(""))
    .transpose()
    .map((value) => value.join(""));
};

Array.prototype.unique = function (includeNonUniqueOnce = true) {
  return this.filter((value, index) => (includeNonUniqueOnce ? this.indexOf(value) === index : this.count(value) === 1));
};

Array.prototype.nonUnique = function () {
  return this.filter((value) => this.count(value) !== 1);
};

/**
 * Finds the max values in a double array. For example:
 * [[0,0],[0,4],[3,0],[1,1]]
 * This would return [3,4]
 */
Array.prototype.maxValues = function () {
  return this.reduce((xy, curr) => [Math.max(xy[0], curr[0]), Math.max(xy[1], curr[1])], [0, 0]);
};

/**
 * Finds the min values in a double array. For example:
 * [[2,-2],[0,4],[-3,0],[1,1]]
 * This would return [-3,-2]
 */
Array.prototype.minValues = function () {
  return this.reduce((xy, curr) => [Math.min(xy[0], curr[0]), Math.min(xy[1], curr[1])], [0, 0]);
};
