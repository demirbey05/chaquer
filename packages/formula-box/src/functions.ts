import { Army } from "./types";

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

export const functions = [functionOne, functionTwo];
