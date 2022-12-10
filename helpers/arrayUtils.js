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

Array.prototype.product = function () {
  return this.reduce((sum, value) => sum * value, 1);
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

const combinations = (input, combinationLength, startPosition = 0, currentCombination = [], result = [], itemsToAdd = combinationLength) => {
  if (itemsToAdd === 0) {
    result.push(currentCombination);
    return;
  }
  for (let i = startPosition; i <= input.length - itemsToAdd; i++) {
    currentCombination[combinationLength - itemsToAdd] = input[i];
    combinations(input, combinationLength, i + 1, currentCombination.slice(), result, itemsToAdd - 1);
  }
  return result;
};

/**
 * Returns a new arrays with all combinations of the given length.
 * Note that this function differs from permute in the way that this function will return all possible combinations,
 * and not all permutations.
 * For example this would return only [1,2], while permute would return both [1,2] and [2,1].
 */
Array.prototype.combine = function (length = this.length) {
  return combinations(this, length);
};

/**
 * Returns a new array with all permutations of the given length. If no length is specified it will use the length of
 * this array.
 * Note that this function differs from combine in the way that this function will return all possible permutations,
 * and not just all combinations.
 * For example this would return both [1,2] and [2,1], while combine would only return [1,2].
 *
 * For example:
 * [1,2,3].permute()
 * Will return:
 * [[1,2,3],[1,3,2],[2,1,3]...]
 *
 * [1,2,3].permute(2)
 * Will return:
 * [[1,2],[1,3],[2,3],[2,1]...]
 */
Array.prototype.permute = function (length = this.length) {
  return this.combine(length).flatMap((combination) => {
    const combinationLength = combination.length;
    const input = combination.slice();
    const result = [input.slice()],
      c = new Array(combinationLength).fill(0);
    let i = 1,
      k,
      p;

    while (i < combinationLength) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = input[i];
        input[i] = input[k];
        input[k] = p;
        ++c[i];
        i = 1;
        result.push(input.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    return result;
  });
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
