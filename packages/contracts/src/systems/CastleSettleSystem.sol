//SPDX-license-Identifier:MIT

pragma solidity ^0.8.0;
import { System, IWorld } from "solecs/System.sol";
import { getAddressById } from "solecs/utils.sol";
import { MapConfigComponent, ID as MapConfigComponentID } from "components/MapConfigComponent.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "components/PositionComponent.sol";
import { CastleOwnableComponent, ID as CastleOwnableID } from "components/CastleOwnableComponent.sol";
uint256 constant ID = uint256(keccak256("system.CastleSettle"));

error CastleSettle__MapIsNotReady();
error CastleSettle__CoordinatesOutOfBound();
error CastleSettle__TileIsNotEmpty();
error CastleSettle__WrongTerrainType();
error CastleSettle__NoCastleRight();

contract CastleSettleSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function executeTyped(uint32 x, uint32 y) public returns (bytes memory) {
    //Get Components
    address ownerCandidate = msg.sender;
    MapConfigComponent terrainComponent = MapConfigComponent(getAddressById(components, MapConfigComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    CastleOwnableComponent castleOwnableComponent = CastleOwnableComponent(getAddressById(components, CastleOwnableID));

    // Checks
    // Map is not initialized
    //@dev Maybe we can define another component for width and height
    if ((terrainComponent.getTerrainLength()) != 2500) {
      revert CastleSettle__MapIsNotReady();
    }
    // Coordinates is out of bound
    if (!(x < 50 && y < 50 && x >= 0 && y >= 0)) {
      revert CastleSettle__CoordinatesOutOfBound();
    }
    // If there is an another entity at that coordinate
    if (positionComponent.getEntitiesWithValue(abi.encode(Coord(x, y))).length != 0) {
      revert CastleSettle__TileIsNotEmpty();
    }
    // The terrain type is not land
    if (terrainComponent.getTerrain(x * 50 + y) != hex"01") {
      revert CastleSettle__WrongTerrainType();
    }
    // You can only have one castle
    if (castleOwnableComponent.getEntitiesWithValue(abi.encode(ownerCandidate)).length != 0) {
      revert CastleSettle__NoCastleRight();
    }

    uint256 entityID = uint256(keccak256(abi.encodePacked(x, y, "Castle", ownerCandidate)));

    positionComponent.set(entityID, Coord(x, y));
    castleOwnableComponent.set(entityID, ownerCandidate);
  }

  function execute(bytes memory data) public returns (bytes memory) {
    (uint32 x, uint32 y) = abi.decode(data, (uint32, uint32));

    executeTyped(x, y);
  }
}
