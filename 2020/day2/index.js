import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

const task1 = () => {
  const r = lines.splitEachElementBy(" ").filter((line) =>
    line[2]
      .split("")
      .count(line[1].charAt(0))
      .isBetweenOrEqual(...line[0].split("-").toNumber())
  );

  console.log(r.length);
};

const task2 = () => {
  const r = lines.splitEachElementBy(" ").filter((line) => {
    const pos = line[0].split("-").toNumber(-1);
    return (
      line[2].split("").filter((v, i) => {
        return v === line[1].charAt(0) && pos.includes(i);
      }).length === 1
    );
  });

  console.log(r.length);
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
