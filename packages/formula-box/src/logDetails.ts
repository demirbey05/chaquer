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
  } else if (armyOneScore < armyTwoScore) {
    console.log("Army Two is won");
  } else {
    console.log("Tie");
  }

  console.log(
    `Army One Score is ${armyOneScore}, Army Two Score is ${armyTwoScore}`
  );

  console.log("");
};

//A1

//-67 swords
// 64 arch
// -6 cav
