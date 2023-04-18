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
      /*console.log("NumRemaining:");
      console.log("1");
      console.log(remainings.isSwordsman);
      console.log(remainings.isArcher);
      console.log(remainings.isCavalry);*/
      result.scoreArmyOne = calculateScoreSingleRemaining(firstResult, remainings);
      makeInverseResult(firstResult);
      makeInverseRemaining(remainings);
      /*console.log(remainings.isSwordsman);
      console.log(remainings.isArcher);
      console.log(remainings.isCavalry);*/
      result.scoreArmyTwo = calculateScoreDoubleRemaining(firstResult, remainings);

      /*console.log("First Army Score is");
      console.logInt(result.scoreArmyOne);
      console.log("Second Army Score is");
      console.logInt(result.scoreArmyTwo);*/
    } else if (remainings.numRemaining == 2) {
      /*console.log("NumRemaining:");
      console.log("2");*/
      result.scoreArmyOne = calculateScoreDoubleRemaining(firstResult, remainings);
      makeInverseResult(firstResult);
      makeInverseRemaining(remainings);
      result.scoreArmyTwo = calculateScoreSingleRemaining(firstResult, remainings);
      /*console.log("First Army Score is");
      console.logInt(result.scoreArmyOne);
      console.log("Second Army Score is");
      console.logInt(result.scoreArmyTwo);*/
    } else if (remainings.numRemaining == 3) {
      result.scoreArmyOne = firstResult.swordsman + firstResult.archer + firstResult.cavalry;
      makeInverseResult(firstResult);
      result.scoreArmyTwo = firstResult.swordsman + firstResult.archer + firstResult.cavalry;
      /*console.log("First Army Score is");
      console.logInt(result.scoreArmyOne);
      console.log("Second Army Score is");
      console.logInt(result.scoreArmyTwo);*/
    } else {
      revert ErrorInCalculatingBattleScores();
    }
  }
}
