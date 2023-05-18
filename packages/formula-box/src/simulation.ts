import { Army } from "./types";
import { logDetails } from "./logDetails";

const generateAnArmy = (maxArmySize: number): Army => {
  const numSwordsman: number = Math.floor(Math.random() * (maxArmySize + 1));
  const numArcher: number = Math.floor(
    Math.random() * (maxArmySize - numSwordsman + 1)
  );
  const numCavalry: number = Math.floor(
    Math.random() * (maxArmySize - numSwordsman - numArcher + 1)
  );

  return { numSwordsman, numArcher, numCavalry };
};

export const simulation = (
  num_iter: number,
  cb: (arg0: Army, arg1: Army) => number,
  maxArmySize: number = 100
): void => {
  for (let i = 0; i < num_iter; i++) {
    const armyOne = generateAnArmy(maxArmySize);
    const armyTwo = generateAnArmy(maxArmySize);
    const armyOneScore = cb(armyOne, armyTwo);
    const armyTwoScore = cb(armyTwo, armyOne);

    logDetails(armyOne, armyTwo, armyOneScore, armyTwoScore);
  }
};
