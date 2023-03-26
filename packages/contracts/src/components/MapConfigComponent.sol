// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { BareComponent } from "solecs/BareComponent.sol";
import { LibTypes } from "solecs/LibTypes.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";

uint256 constant SingletonID = 0x60D;

uint256 constant ID = uint256(keccak256("component.MapConfig"));

contract MapConfigComponent is BareComponent {
  uint256 public currentTerrainLength;

  constructor(address world) BareComponent(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](1);
    values = new LibTypes.SchemaValue[](1);

    keys[0] = "value";
    values[0] = LibTypes.SchemaValue.STRING;
  }

  function getTerrainLength() public view returns (uint256) {
    return currentTerrainLength;
  }

  function set(bytes memory terrainPart) public {
    set(SingletonID, terrainPart);
  }

  function getValue() public view returns (bytes memory) {
    return getRawValue(SingletonID);
  }

  function getTerrain(uint256 index) public view returns (bytes1) {
    bytes memory data = getValue();
    return data[index];
  }
}
