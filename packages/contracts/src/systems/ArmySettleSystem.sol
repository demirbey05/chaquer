//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { System, IWorld } from "solecs/System.sol";
import { getAddressById } from "solecs/utils.sol";
import { ArmyConfigComponent, ID as ArmyConfigComponentID, ArmyConfig } from "components/ArmyConfigComponent.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "components/PositionComponent.sol";
import { ArmyOwnableComponent, ID as ArmyOwnableComponentID } from "components/ArmyOwnableComponent.sol";
import { CastleOwnableComponent, ID as CastleOwnableComponentID } from "components/CastleOwnableComponent.sol";
import { MapConfigComponent, ID as MapConfigComponentID } from "components/MapConfigComponent.sol";

import { LibMath } from "libraries/LibMath.sol";

uint256 constant ID = uint256(keccak256("system.ArmySettle"));

error CoordinatesOutOfBound();
error TileIsNotEmpty();
error NoArmyRight();
error NoCastle();
error TooFarToSettle();
error TooManySoldier();
error WrongTerrainType();

contract ArmySettleSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function executeTyped(Coord memory coord, ArmyConfig memory armyConfiguration) public returns (bytes memory) {
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    ArmyOwnableComponent armyOwnable = ArmyOwnableComponent(getAddressById(components, ArmyOwnableComponentID));
    CastleOwnableComponent castleOwnable = CastleOwnableComponent(getAddressById(components, CastleOwnableComponentID));
    ArmyConfigComponent armyConfig = ArmyConfigComponent(getAddressById(components, ArmyConfigComponentID));
    MapConfigComponent terrainComponent = MapConfigComponent(getAddressById(components, MapConfigComponentID));

    address ownerCandidate = msg.sender;

    // Coordinates is out of bound
    if (!(coord.x < 100 && coord.y < 100 && coord.x >= 0 && coord.y >= 0)) {
      revert CoordinatesOutOfBound();
    }
    if (terrainComponent.getTerrain(coord.y * 100 + coord.x) != hex"01") {
      revert WrongTerrainType();
    }
    // If there is an another entity at that coordinate
    if (positionComponent.getEntitiesWithValue(abi.encode(coord)).length != 0) {
      revert TileIsNotEmpty();
    }
    // You can have three army
    if (armyOwnable.getEntitiesWithValue(abi.encode(ownerCandidate)).length >= 3) {
      revert NoArmyRight();
    }
    if (castleOwnable.getEntitiesWithValue(abi.encode(ownerCandidate)).length != 1) {
      revert NoCastle();
    }
    Coord memory castlePosition = positionComponent.getValue(
      castleOwnable.getEntitiesWithValue(abi.encode(ownerCandidate))[0]
    );
    uint32 distanceBetween = LibMath.manhattan(castlePosition, coord);

    if (distanceBetween > 3) {
      revert TooFarToSettle();
    }
    if (armyConfiguration.numArcher + armyConfiguration.numCavalry + armyConfiguration.numSwordsman != 100) {
      revert TooManySoldier();
    }

    uint256 entityID = uint256(keccak256(abi.encodePacked(coord.x, coord.y, "Army", ownerCandidate)));

    positionComponent.set(entityID, coord);
    armyOwnable.set(entityID, ownerCandidate);
    armyConfig.set(entityID, armyConfiguration);
  }

  function execute(bytes memory args) public returns (bytes memory) {
    (uint32 coord_x, uint32 coord_y, uint32 numSwordsman, uint32 numArcher, uint32 numCavalry) = abi.decode(
      args,
      (uint32, uint32, uint32, uint32, uint32)
    );
    return executeTyped(Coord(coord_x, coord_y), ArmyConfig(numSwordsman, numArcher, numCavalry));
  }
}
