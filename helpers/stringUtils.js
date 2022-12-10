String.prototype.replaceAll = function (search, replacement) {
  return this.split(search).join(replacement);
};

String.prototype.replaceAt = function (index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
};

String.prototype.insertAt = function (index, value) {
  return this.substring(0, index) + value + this.substring(index);
};

String.prototype.removeAt = function (index) {
  return this.substring(0, index) + this.substring(index + 1);
};

String.prototype.reverse = function () {
  return this.split("").reverse().join("");
};

String.prototype.everyNthChar = function (step, startIndex) {
  return this.split("").everyNthElement(step, startIndex).join("");
};

String.prototype.intersect = function (other) {
  return this.split("").intersect(other.split("")).join("");
};

String.prototype.except = function (other) {
  return this.split("").except(other.split("")).join("");
};

String.prototype.binaryToNumber = function () {
  return parseInt(this, 2);
};

String.prototype.hexToNumber = function () {
  return parseInt(this, 16);
};

export const lowercaseLetters = [...new Array(26)].map((e, i) => String.fromCharCode(i + 97));
export const uppercaseLetters = [...new Array(26)].map((e, i) => String.fromCharCode(i + 65));

export const getString = (nChars, char = " ") => {
  return new Array(nChars).fill(char).join("");
};
