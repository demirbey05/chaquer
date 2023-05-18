import { Army } from "./types";
import { findRemainings } from "./utils";
import { calculateScoreOne, calculateScoreTwo } from "./utils";

const functionOne = (armyOne: Army, armyTwo: Army): number => {
  const swordsManScore =
    armyOne.numSwordsman -
    armyTwo.numSwordsman +
    (2 * armyOne.numSwordsman - armyTwo.numArcher) +
    (0.5 * armyOne.numSwordsman - armyTwo.numCavalry);

  const archerScore =
    armyOne.numArcher -
    armyTwo.numArcher +
    (2 * armyOne.numArcher - armyTwo.numCavalry) +
    (0.5 * armyOne.numArcher - armyTwo.numSwordsman);

  const cavalryScore =
    armyOne.numCavalry -
    armyTwo.numCavalry +
    (2 * armyOne.numCavalry - armyTwo.numSwordsman) +
    (0.5 * armyOne.numCavalry - armyTwo.numArcher);

  return swordsManScore * archerScore * cavalryScore;
};

const functionTwo = (armyOne: Army, armyTwo: Army): number => {
  const swordsManScore =
    armyOne.numSwordsman -
    armyTwo.numSwordsman +
    (2 * armyOne.numSwordsman - armyTwo.numArcher) +
    (0.5 * armyOne.numSwordsman - armyTwo.numCavalry);

  const archerScore =
    armyOne.numArcher -
    armyTwo.numArcher +
    (2 * armyOne.numArcher - armyTwo.numCavalry) +
    (0.5 * armyOne.numArcher - armyTwo.numSwordsman);

  const cavalryScore =
    armyOne.numCavalry -
    armyTwo.numCavalry +
    (2 * armyOne.numCavalry - armyTwo.numSwordsman) +
    (0.5 * armyOne.numCavalry - armyTwo.numArcher);

  return swordsManScore + archerScore + cavalryScore;
};

const functionThree = (armyOne: Army, armyTwo: Army): number => {
  const firstDiff = { swordsman: 0, archer: 0, cavalry: 0 };
  firstDiff.swordsman = armyOne.numSwordsman - armyTwo.numSwordsman;
  firstDiff.archer = armyOne.numArcher - armyTwo.numArcher;
  firstDiff.cavalry = armyOne.numCavalry - armyTwo.numCavalry;

  const remainings = findRemainings(firstDiff);

  let result = 0;

  if (remainings.length === 1) {
    result = calculateScoreOne(firstDiff, remainings[0]);
  } else if (remainings.length === 2) {
    result = calculateScoreTwo(firstDiff, remainings[0], remainings[1]);
  } else if (remainings.length === 3) {
    return 100;
  } else {
    return -15000;
  }

  return result;
};
export const functions = [functionOne, functionTwo, functionThree];
