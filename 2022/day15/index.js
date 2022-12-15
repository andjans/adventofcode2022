import data from "./input.js";
import testData from "./test.js";
import "../../helpers/helpers.js";
import { Point } from "../../helpers/Point.js";

const lines = data.split("\n");
const testLines = testData.split("\n");

function checkAndPush(x0, x1, fromTo) {
  let pushX = x0;
  let pushX2 = x1;
  fromTo.forEach((e) => {
    if (pushX.isBetweenOrEqual(e[0], e[1])) {
      pushX = e[1] + 1;
    }
    if (pushX2.isBetweenOrEqual(e[0], e[1])) {
      pushX2 = e[0] - 1;
    }
  });
  if (pushX2 >= pushX) {
    for (const [index, e] of fromTo.entries()) {
      if (e[0].isBetweenOrEqual(pushX, pushX2) && e[1].isBetweenOrEqual(pushX, pushX2)) {
        fromTo.splice(index, 1);
      }
    }
    fromTo.push([pushX, pushX2]);
  }
}

function parseLines(linesToParse) {
  const sensorAndBeacons = linesToParse.map((x) => {
    const sensorParts = x[0].split(" ");
    const sensor = [
      Number(sensorParts[2].replaceAll("x=", "").replaceAll(",", "")),
      Number(sensorParts[3].replaceAll("y=", "")),
      "s",
    ];
    const beaconParts = x[1].split(" ");
    const beacon = [
      Number(beaconParts[4].replaceAll("x=", "").replaceAll(",", "")),
      Number(beaconParts[5].replaceAll("y=", "")),
      "b",
    ];
    return [sensor, beacon];
  });

  return sensorAndBeacons.map((e) => {
    const sensorPoint = new Point(e[0][0], e[0][1]);
    const beaconPoint = new Point(e[1][0], e[1][1]);
    const dist = sensorPoint.distanceTo(beaconPoint, false);
    return {
      x: [sensorPoint.x - dist, sensorPoint.x + dist],
      y: [sensorPoint.y - dist, sensorPoint.y + dist],
      s: sensorPoint,
      b: beaconPoint,
    };
  });
}

const task1 = () => {
  const splittedLines = lines.splitEachElementBy(": ");
  const parsedLines = parseLines(splittedLines);

  const fromTo = [];
  const checkY = 2000000;
  parsedLines.forEach((e) => {
    const distToSensor = Math.abs(e.s.y - checkY);
    checkAndPush(e.x[0] + distToSensor, e.x[1] - distToSensor, fromTo);
    if (e.b.y === checkY) {
      checkAndPush(e.b.x, e.b.x, fromTo);
    }
  });

  console.log(fromTo);
  const beacons = parsedLines
    .filter((e) => e.b.y === checkY)
    .map((e) => e.b.x)
    .unique();
  console.log(beacons);
  console.log(fromTo.map((e) => e[1] - e[0] + 1).sum() - beacons.length);
};

const task2 = () => {
  const splittedLines = lines.splitEachElementBy(": ");
  const parsedLines = parseLines(splittedLines);

  let fromTo = [];
  const maxXY = 4000000;
  for (let checkY = 0; checkY < maxXY; checkY++) {
    parsedLines.forEach((e) => {
      const distToSensor = Math.abs(e.s.y - checkY);
      if (e.x[0] + distToSensor >= 0 || e.x[1] + distToSensor <= maxXY) {
        checkAndPush(
          Math.max(e.x[0] + distToSensor, 0),
          Math.min(e.x[1] - distToSensor, maxXY),
          fromTo
        );
      }
      if (e.b.y === checkY) {
        if (e.b.x >= 0 || e.b.x <= maxXY) {
          checkAndPush(Math.max(e.b.x, 0), Math.min(e.b.x, maxXY), fromTo);
        }
      }
    });

    const beacons = parsedLines
      .filter((e) => e.b.y === checkY)
      .map((e) => e.b.x)
      .unique();
    const starts = fromTo.map((e) => e[0]);
    const ends = fromTo.map((e) => e[1]);
    const found = starts.filter((start) => start > 0 && !ends.includes(start - 1));
    if (found.length > 0 && !beacons.includes(found[0] - 1)) {
      console.log((found[0] - 1) * maxXY + checkY);
      break;
    }
    fromTo = [];
  }
};

console.log("---- task 1 ----");
task1();
console.log("----------------");
console.log("");
console.log("---- task 2 ----");
task2();
console.log("----------------");
console.log("");
