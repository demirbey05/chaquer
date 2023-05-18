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

error ArmySettle__CoordinatesOutOfBound();
error ArmySettle__TileIsNotEmpty();
error ArmySettle__NoArmyRight();
error ArmySettle__NoCastle();
error ArmySettle__TooFarToSettle();
error ArmySettle__TooManySoldier();
error ArmySettle__WrongTerrainType();

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
    if (!(coord.x < 50 && coord.y < 50 && coord.x >= 0 && coord.y >= 0)) {
      revert ArmySettle__CoordinatesOutOfBound();
    }
    if (terrainComponent.getTerrain(coord.x * 50 + coord.y) != hex"01") {
      revert ArmySettle__WrongTerrainType();
    }
    // If there is an another entity at that coordinate
    if (positionComponent.getEntitiesWithValue(abi.encode(coord)).length != 0) {
      revert ArmySettle__TileIsNotEmpty();
    }
    // You can have three army
    if (armyOwnable.getEntitiesWithValue(abi.encode(ownerCandidate)).length >= 3) {
      revert ArmySettle__NoArmyRight();
    }
    if (castleOwnable.getEntitiesWithValue(abi.encode(ownerCandidate)).length < 1) {
      revert ArmySettle__NoCastle();
    }

    uint256[] memory castleIds = castleOwnable.getEntitiesWithValue(abi.encode(ownerCandidate));
    uint256 castleClose = 0;
    for (uint i = 0; i < castleIds.length; i++) {
      Coord memory castlePosition = positionComponent.getValue(castleIds[i]);
      uint32 distanceBetween = LibMath.manhattan(castlePosition, coord);
      if (distanceBetween <= 3) {
        castleClose = 1;
      }
    }
    if (castleClose == 0) {
      revert ArmySettle__NoCastle();
    }

    if (armyConfiguration.numArcher + armyConfiguration.numCavalry + armyConfiguration.numSwordsman > 100) {
      revert ArmySettle__TooManySoldier();
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
