//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { BattleResult, RemainingData } from "./Types.sol";

//import {console} from "forge-std/console.sol"

function findRemainings(BattleResult memory result) pure returns (RemainingData memory remainings) {
  if (result.swordsman > 0) {
    remainings.isSwordsman = 1;
    remainings.numRemaining++;
  }
  if (result.archer > 0) {
    remainings.isArcher = 1;
    remainings.numRemaining++;
  }
  if (result.cavalry > 0) {
    remainings.isCavalry = 1;
    remainings.numRemaining++;
  }
  return remainings;
}

function calculateScoreSingleRemaining(
  BattleResult memory scoreArray,
  RemainingData memory remainings
) returns (int32 result) {
  if (remainings.isSwordsman == 1) {
    result = (scoreArray.swordsman + 2 * scoreArray.cavalry + (scoreArray.archer / 2));
  }
  if (remainings.isArcher == 1) {
    result = (scoreArray.archer + 2 * scoreArray.swordsman + (scoreArray.cavalry / 2));
  }
  if (remainings.isCavalry == 1) {
    result = (scoreArray.cavalry + 2 * scoreArray.archer + (scoreArray.swordsman / 2));
  }
}

function calculateScoreDoubleRemaining(
  BattleResult memory scoreArray,
  RemainingData memory remainings
) returns (int32 result) {
  if (remainings.isSwordsman == 1) {
    result = remainings.isArcher == 1
      ? scoreArray.swordsman + 2 * scoreArray.cavalry
      : scoreArray.swordsman + (scoreArray.archer / 2);

    //console.log("Second first remainings swordsman");
    //console.logInt(result);
  } else if (remainings.isArcher == 1) {
    result = remainings.isCavalry == 1
      ? scoreArray.archer + 2 * scoreArray.swordsman
      : scoreArray.archer + (scoreArray.cavalry / 2);
    //console.log("Second first remainings archer");
    //console.logInt(result);
  } else if (remainings.isCavalry == 1) {
    result = remainings.isSwordsman == 1
      ? scoreArray.cavalry + 2 * scoreArray.archer
      : scoreArray.cavalry + (scoreArray.swordsman / 2);
    //console.log("Second first remainings cav");
    //console.logInt(result);
  }

  if (result < 0) {
    if (remainings.isCavalry == 1) {
      result = remainings.isSwordsman == 1 ? scoreArray.cavalry + 2 * result : scoreArray.cavalry + (result / 2);
      //console.log("Second second remainings cav <0 ");
      //console.logInt(result);
    } else if (remainings.isArcher == 1) {
      result = remainings.isCavalry == 1 ? scoreArray.archer + 2 * result : scoreArray.archer + (result / 2);
      //console.log("Second second remainings arch <0");
      //console.logInt(result);
    } else if (remainings.isSwordsman == 1) {
      result = remainings.isArcher == 1 ? scoreArray.swordsman + 2 * result : scoreArray.swordsman + (result / 2);
      //console.log("Second second remainings sw <0");
      //console.logInt(result);
    }
  } else {
    if (remainings.isCavalry == 1) {
      result = result + scoreArray.cavalry;
      //console.log("Second second remainings cav >0 ");
      //console.logInt(result);
    }
    if (remainings.isArcher == 1) {
      result = result + scoreArray.archer;
      //console.log("Second second remainings arch >0 ");
      //console.logInt(result);
    }
    if (remainings.isSwordsman == 1) {
      result = result + scoreArray.swordsman;
      //console.log("Second second remainings sw >0 ");
      //console.logInt(result);
    }
  }
}

function makeInverseResult(BattleResult memory scoreArray) pure {
  scoreArray.swordsman = -scoreArray.swordsman;
  scoreArray.archer = -scoreArray.archer;
  scoreArray.cavalry = -scoreArray.cavalry;
}

function makeInverseRemaining(RemainingData memory remainings) pure {
  remainings.isSwordsman = 1 - remainings.isSwordsman;
  remainings.isArcher = 1 - remainings.isArcher;
  remainings.isCavalry = 1 - remainings.isCavalry;
  remainings.numRemaining = 3 - remainings.numRemaining;
}
