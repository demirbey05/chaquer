//SPDX-Licence-Identifier:MIT

pragma solidity ^0.8.0;

import { System, IWorld } from "solecs/System.sol";
import { getAddressById } from "solecs/utils.sol";
import { ArmyOwnableComponent, ID as ArmyOwnableComponentID } from "components/ArmyOwnableComponent.sol";
import { ArmyConfigComponent, ID as ArmyConfigComponentID, ArmyConfig } from "components/ArmyConfigComponent.sol";
import { PositionComponent, ID as PositionComponentID } from "components/PositionComponent.sol";
import { LibMath } from "libraries/LibMath.sol";
import { LibAttack } from "libraries/LibAttack.sol";
import { BattleScore } from "libraries/Types.sol";
uint256 constant ID = uint256(keccak256("system.Attack"));

error ArmyNotBelongYou();
error TooAwayToAttack();
error NoArmy();

contract AttackSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    (uint256 armyOneID, uint256 armyTwoID) = abi.decode(args, (uint256, uint256));
    return executeTyped(armyOneID, armyTwoID);
  }

  function executeTyped(uint256 armyOneID, uint256 armyTwoID) public returns (bytes memory) {
    ArmyOwnableComponent armyOwnable = ArmyOwnableComponent(getAddressById(components, ArmyOwnableComponentID));
    ArmyConfigComponent armyConfig = ArmyConfigComponent(getAddressById(components, ArmyConfigComponentID));
    PositionComponent position = PositionComponent(getAddressById(components, PositionComponentID));

    if (armyOwnable.getValue(armyOneID) != msg.sender) {
      revert ArmyNotBelongYou();
    }
    if (!armyOwnable.has(armyTwoID)) {
      revert NoArmy();
    }
    uint32 distanceBetween = LibMath.manhattan(position.getValue(armyOneID), position.getValue(armyTwoID));

    if (!(distanceBetween < 3)) {
      revert TooAwayToAttack();
    }

    ArmyConfig memory armyOne = armyConfig.getValue(armyOneID);
    ArmyConfig memory armyTwo = armyConfig.getValue(armyTwoID);

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

      return new bytes(1);
    } else if (battleScore.scoreArmyOne < battleScore.scoreArmyTwo) {
      armyConfig.remove(armyOneID);
      armyOwnable.remove(armyOneID);

      ArmyConfig memory newConfig = ArmyConfig(
        armyTwo.numSwordsman >> 1,
        armyTwo.numArcher >> 1,
        armyTwo.numCavalry >> 1
      );
      armyConfig.set(armyTwoID, newConfig);
      return new bytes(2);
    } else {
      return new bytes(0);
    }
  }
}
