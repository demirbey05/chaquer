//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import { ArmyConfig } from "components/ArmyConfigComponent.sol";
import { BattleResult, BattleScore, RemainingData } from "./Types.sol";
import { findRemainings, calculateScoreSingleRemaining, makeInverseResult, makeInverseRemaining, calculateScoreDoubleRemaining } from "./utils.sol";

error ErrorInCalculatingBattleScores();

library LibAttack {
  function firstBattle(
    ArmyConfig memory armyOne,
    ArmyConfig memory armyTwo
  ) internal pure returns (BattleResult memory firstBattle) {
    firstBattle.swordsman = int32(armyOne.numSwordsman) - int32(armyTwo.numSwordsman);
    firstBattle.archer = int32(armyOne.numArcher) - int32(armyTwo.numArcher);
    firstBattle.cavalry = int32(armyOne.numCavalry) - int32(armyTwo.numCavalry);
  }

  function calculateBattleScores(
    ArmyConfig memory armyOne,
    ArmyConfig memory armyTwo
  ) internal returns (BattleScore memory result) {
    BattleResult memory firstResult = firstBattle(armyOne, armyTwo);
    RemainingData memory remainings = findRemainings(firstResult);

    if (remainings.numRemaining == 1) {
      result.scoreArmyOne = calculateScoreSingleRemaining(firstResult, remainings);
      makeInverseResult(firstResult);
      makeInverseRemaining(remainings);
      result.scoreArmyTwo = calculateScoreDoubleRemaining(firstResult, remainings);
    } else if (remainings.numRemaining == 2) {
      result.scoreArmyOne = calculateScoreDoubleRemaining(firstResult, remainings);
      makeInverseResult(firstResult);
      makeInverseRemaining(remainings);
      result.scoreArmyOne = calculateScoreSingleRemaining(firstResult, remainings);
    } else if (remainings.numRemaining == 3) {
      result.scoreArmyOne = firstResult.swordsman + firstResult.archer + firstResult.cavalry;
      makeInverseResult(firstResult);
      result.scoreArmyTwo = firstResult.swordsman + firstResult.archer + firstResult.cavalry;
    } else {
      revert ErrorInCalculatingBattleScores();
    }
  }
}
