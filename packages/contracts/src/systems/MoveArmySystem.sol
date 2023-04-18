//SPDX-Licence-Identifier:MIT

pragma solidity ^0.8.0;

import { System, IWorld } from "solecs/System.sol";
import { getAddressById } from "solecs/utils.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "components/PositionComponent.sol";
import { ArmyOwnableComponent, ID as ArmyOwnableComponentID } from "components/ArmyOwnableComponent.sol";
import { LibMath } from "libraries/LibMath.sol";

uint256 constant ID = uint256(keccak256("system.MoveArmy"));

error NoAuthorized();
error TooFar();

contract MoveArmySystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    (uint256 entityID, uint32 x, uint32 y) = abi.decode(args, (uint256, uint32, uint32));
    executeTyped(entityID, Coord(x, y));
  }

  function executeTyped(uint256 armyOneID, Coord memory target) public returns (bytes memory) {
    ArmyOwnableComponent armyOwnable = ArmyOwnableComponent(getAddressById(components, ArmyOwnableComponentID));
    PositionComponent position = PositionComponent(getAddressById(components, PositionComponentID));

    if (armyOwnable.getValue(armyOneID) != msg.sender) {
      revert NoAuthorized();
    }
    if (LibMath.manhattan(target, position.getValue(armyOneID)) >= 3) {
      revert TooFar();
    }

    position.set(armyOneID, target);
  }
}
