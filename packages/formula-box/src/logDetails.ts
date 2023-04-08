import { Army } from "./types";

export const logDetails = (
  armyOne: Army,
  armyTwo: Army,
  armyOneScore: number,
  armyTwoScore: number
) => {
  console.log("-----------------------");
  console.log(
    `Army One Details : ${armyOne.numSwordsman} Swordsman,${armyOne.numArcher} Archer, ${armyOne.numCavalry} Cavalry`
  );
  console.log(
    `Army Two Details : ${armyTwo.numSwordsman} Swordsman,${armyTwo.numArcher} Archer, ${armyTwo.numCavalry} Cavalry`
  );
  if (armyOneScore > armyTwoScore) {
    console.log("Army One is won");
  } else {
    console.log("Army Two is won");
  }

  console.log(
    `Army One Score is ${armyOneScore}, Army Two Score is ${armyTwoScore}`
  );

  console.log("");
};
