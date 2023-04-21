//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import { ArmyConfig } from "components/ArmyConfigComponent.sol";
import { BattleResult, BattleScore, RemainingData } from "./Types.sol";
import { findRemainings, calculateScoreSingleRemaining, calculateScoreDoubleRemaining, calculateArmyScore } from "./utils.sol";
import { ArmyConfigComponent } from "components/ArmyConfigComponent.sol";
import { ArmyOwnableComponent } from "components/ArmyOwnableComponent.sol";
import { console } from "forge-std/console.sol";

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
    BattleResult memory firstResultOne = firstBattle(armyOne, armyTwo);
    BattleResult memory firstResultTwo = firstBattle(armyTwo, armyOne);
    RemainingData memory remainingsOne = findRemainings(firstResultOne);
    RemainingData memory remainingsTwo = findRemainings(firstResultTwo);

    result.scoreArmyOne = calculateArmyScore(firstResultOne, remainingsOne);
    console.log("First Army Score is ");
    console.logInt(result.scoreArmyOne);
    result.scoreArmyTwo = calculateArmyScore(firstResultTwo, remainingsTwo);
    console.log("Second Army Score is ");
    console.logInt(result.scoreArmyTwo);
  }

  function warCaptureCastle(
    uint256 attackerArmyID,
    uint256[] memory defenderArmies,
    ArmyConfigComponent armyConfig,
    ArmyOwnableComponent armyOwnable
  ) internal returns (bytes memory) {
    ArmyConfig memory attackerArmy = armyConfig.getValue(attackerArmyID);
    ArmyConfig memory defenderArmy;

    for (uint i = 0; i < defenderArmies.length; i++) {
      ArmyConfig memory currentArmy = armyConfig.getValue(defenderArmies[i]);
      defenderArmy.numSwordsman += currentArmy.numSwordsman;
      defenderArmy.numArcher += currentArmy.numArcher;
      defenderArmy.numCavalry += currentArmy.numCavalry;
    }
    console.log("Attacker Army is");
    BattleScore memory battleScore = calculateBattleScores(attackerArmy, defenderArmy);

    if (battleScore.scoreArmyOne > battleScore.scoreArmyTwo) {
      for (uint i = 0; i < defenderArmies.length; i++) {
        armyOwnable.remove(defenderArmies[i]);
        armyConfig.remove(defenderArmies[i]);
      }
      ArmyConfig memory newConfig = ArmyConfig(
        attackerArmy.numSwordsman >> 1,
        attackerArmy.numArcher >> 1,
        attackerArmy.numCavalry >> 1
      );
      armyConfig.set(attackerArmyID, newConfig);
      return abi.encode(1, battleScore.scoreArmyOne);
    } else if (battleScore.scoreArmyOne < battleScore.scoreArmyTwo) {
      armyOwnable.remove(attackerArmyID);
      armyConfig.remove(attackerArmyID);
      ArmyConfig memory currentArmy;
      for (uint i = 0; i < defenderArmies.length; i++) {
        currentArmy = armyConfig.getValue(defenderArmies[i]);
        ArmyConfig memory newConfig = ArmyConfig(
          currentArmy.numSwordsman >> 1,
          currentArmy.numArcher >> 1,
          currentArmy.numCavalry >> 1
        );
        armyConfig.set(defenderArmies[i], newConfig);
      }
      return abi.encode(2, battleScore.scoreArmyTwo);
    } else {
      armyOwnable.remove(attackerArmyID);
      armyConfig.remove(attackerArmyID);
      for (uint i = 0; i < defenderArmies.length; i++) {
        armyOwnable.remove(defenderArmies[i]);
        armyConfig.remove(defenderArmies[i]);
      }
      return abi.encode(0, 0);
    }
  }
}

/* function warBetweenArmies(
    uint256 armyOneID,
    uint256 armyTwoID,
    ArmyConfigComponent armyConfig,
    ArmyOwnableComponent armyOwnable
  ) internal returns (bytes memory) {
    ArmyConfig memory armyOne = armyConfig.getValue(armyOneID);
    ArmyConfig memory armyTwo = armyConfig.getValue(armyTwoID);

    console.log("Army ONE");
    console.log(armyOne.numSwordsman);
    console.log(armyOne.numArcher);
    console.log(armyOne.numCavalry);
    console.log("Army two");
    console.log(armyTwo.numSwordsman);
    console.log(armyTwo.numArcher);
    console.log(armyTwo.numCavalry);

    BattleScore memory battleScore = LibAttack.calculateBattleScores(armyOne, armyTwo);

    if (battleScore.scoreArmyOne > battleScore.scoreArmyTwo) {
      armyConfig.remove(armyTwoID);
      armyOwnable.remove(armyTwoID);

      ArmyConfig memory newConfig = ArmyConfig(
        armyOne.numSwordsman >> 1,
        armyOne.numArcher >> 1,
        armyOne.numCavalry >> 1
      );
      armyConfig.set(armyOneID, newConfig);

      return abi.encode(1, battleScore.scoreArmyOne);
    } else if (battleScore.scoreArmyOne < battleScore.scoreArmyTwo) {
      armyConfig.remove(armyOneID);
      armyOwnable.remove(armyOneID);

      ArmyConfig memory newConfig = ArmyConfig(
        armyTwo.numSwordsman >> 1,
        armyTwo.numArcher >> 1,
        armyTwo.numCavalry >> 1
      );
      armyConfig.set(armyTwoID, newConfig);
      return abi.encode(2, battleScore.scoreArmyTwo);
    } else {
      armyConfig.remove(armyTwoID);
      armyOwnable.remove(armyTwoID);
      armyConfig.remove(armyOneID);
      armyOwnable.remove(armyOneID);

      return abi.encode(0, battleScore.scoreArmyOne);
    }
  }*/
