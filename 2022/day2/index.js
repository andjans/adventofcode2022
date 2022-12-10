import data from "./input.js";

const task1 = () => {
  const scores = data.map((round) => {
    const shapeScore = mapToScore(round[1]);
    const fightScore = fight(round[0], round[1]);
    return shapeScore + fightScore;
  });
  console.log(scores.reduce((sum, val) => sum + val, 0));
};

const task2 = () => {
  const scores = data.map((round) => {
    const myShape = findShape(round[0], round[1]);
    const shapeScore = mapToScore(myShape);
    const fightScore = fight(round[0], myShape);
    return shapeScore + fightScore;
  });
  console.log(scores.reduce((sum, val) => sum + val, 0));
};

const findShape = (opp, me) => {
  if (me === "Y") return mapOppToMe(opp);

  switch (me) {
    case "X": {
      if (opp === "A") return "Z";
      if (opp === "B") return "X";
      else return "Y";
    }
    case "Z": {
      if (opp === "A") return "Y";
      if (opp === "B") return "Z";
      else return "X";
    }
  }
};

const mapOppToMe = (opp) => {
  switch (opp) {
    case "A":
      return "X";
    case "B":
      return "Y";
    case "C":
      return "Z";
  }
};

const fight = (opp, me) => {
  if (mapToScore(opp) === mapToScore(me)) return 3;

  switch (me) {
    case "X": {
      if (opp === "B") return 0;
      else return 6;
    }
    case "Y": {
      if (opp === "A") return 6;
      else return 0;
    }
    case "Z": {
      if (opp === "A") return 0;
      else return 6;
    }
  }
  console.log("SHOULD NEVER HAPPEN!!", opp, me);
};

const mapToScore = (shape) => {
  switch (shape) {
    case "A":
    case "X":
      return 1;
    case "B":
    case "Y":
      return 2;
    case "C":
    case "Z":
      return 3;
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
