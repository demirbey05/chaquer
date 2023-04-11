//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { BattleResult, RemainingData } from "./Types.sol";

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
) returns (int32) {
  if (remainings.isSwordsman == 1) {
    return (2 * scoreArray.swordsman + 4 * scoreArray.cavalry + scoreArray.archer);
  }
  if (remainings.isArcher == 1) {
    return (2 * scoreArray.archer + 4 * scoreArray.swordsman + scoreArray.cavalry);
  }
  if (remainings.isCavalry == 1) {
    return (2 * scoreArray.cavalry + 4 * scoreArray.archer + scoreArray.swordsman);
  }
}

function calculateScoreDoubleRemaining(
  BattleResult memory scoreArray,
  RemainingData memory remainings
) pure returns (int32 result) {
  if (remainings.isSwordsman == 1) {
    result = remainings.isArcher == 1
      ? 2 * scoreArray.swordsman + 4 * scoreArray.cavalry
      : 2 * scoreArray.swordsman + 1 * scoreArray.archer;
  } else if (remainings.isArcher == 1) {
    result = remainings.isCavalry == 1
      ? 2 * scoreArray.archer + 4 * scoreArray.swordsman
      : 2 * scoreArray.archer + 1 * scoreArray.cavalry;
  } else if (remainings.isCavalry == 1) {
    result = remainings.isSwordsman == 1
      ? 2 * scoreArray.cavalry + 4 * scoreArray.archer
      : 2 * scoreArray.cavalry + 1 * scoreArray.swordsman;
  }

  if (result < 0) {
    if (remainings.isCavalry == 1) {
      return remainings.isSwordsman == 1 ? 2 * scoreArray.cavalry + 4 * result : 2 * scoreArray.cavalry + 1 * result;
    } else if (remainings.isArcher == 1) {
      return remainings.isCavalry == 1 ? 2 * scoreArray.archer + 4 * result : 2 * scoreArray.archer + 1 * result;
    } else if (remainings.isSwordsman == 1) {
      return remainings.isArcher == 1 ? 2 * scoreArray.swordsman + 4 * result : 2 * scoreArray.swordsman + 1 * result;
    }
  } else {
    if (remainings.isCavalry == 1) {
      return result + scoreArray.cavalry;
    }
    if (remainings.isArcher == 1) {
      return result + scoreArray.archer;
    }
    if (remainings.isSwordsman == 1) {
      return result + scoreArray.swordsman;
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
