Number.prototype.isBetween = function (a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return this > min && this < max;
};

Number.prototype.isBetweenOrEqual = function (a, b) {
  return this === a || this === b || this.isBetween(a, b);
};

Number.prototype.toHex = function () {
  return this.toString(16);
};

Number.prototype.toBinary = function () {
  return this.toString(2);
};

export const hexToDecimal = (hexString) => parseInt(hexString, 16);
export const decimalToHex = (decimal) => decimal.toString(16);
export const binaryToDecimal = (binaryString) => parseInt(binaryString, 2);
export const decimalToBinary = (decimal) => decimal.toString(2);
export const hexToBinary = (hexString) => decimalToBinary(hexToDecimal(hexString));
export const binaryToHex = (binaryString) => decimalToHex(binaryToDecimal(binaryString));
