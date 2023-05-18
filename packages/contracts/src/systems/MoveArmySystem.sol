//SPDX-Licence-Identifier:MIT

pragma solidity ^0.8.0;

import { System, IWorld } from "solecs/System.sol";
import { getAddressById } from "solecs/utils.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "components/PositionComponent.sol";
import { ArmyOwnableComponent, ID as ArmyOwnableComponentID } from "components/ArmyOwnableComponent.sol";
import { MapConfigComponent, ID as MapConfigComponentID } from "components/MapConfigComponent.sol";
import { LibMath } from "libraries/LibMath.sol";

uint256 constant ID = uint256(keccak256("system.MoveArmy"));

error MoveArmy__NoAuthorized();
error MoveArmy__TooFar();
error MoveArmy__TileIsNotEmpty();
error MoveArmy__WrongTerrainType();

contract MoveArmySystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    (uint256 entityID, uint32 x, uint32 y) = abi.decode(args, (uint256, uint32, uint32));
    executeTyped(entityID, Coord(x, y));
  }

  function executeTyped(uint256 armyOneID, Coord memory target) public returns (bytes memory) {
    ArmyOwnableComponent armyOwnable = ArmyOwnableComponent(getAddressById(components, ArmyOwnableComponentID));
    PositionComponent position = PositionComponent(getAddressById(components, PositionComponentID));
    MapConfigComponent terrainComponent = MapConfigComponent(getAddressById(components, MapConfigComponentID));

    if (armyOwnable.getValue(armyOneID) != msg.sender) {
      revert MoveArmy__NoAuthorized();
    }
    if (terrainComponent.getTerrain(target.x * 50 + target.y) != hex"01") {
      revert MoveArmy__WrongTerrainType();
    }
    if (LibMath.manhattan(target, position.getValue(armyOneID)) > 3) {
      revert MoveArmy__TooFar();
    }
    if (position.getEntitiesWithValue(target).length != 0) {
      revert MoveArmy__TileIsNotEmpty();
    }

    position.set(armyOneID, target);
  }
}
