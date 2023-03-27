// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { Component } from "solecs/Component.sol";
import { LibTypes } from "solecs/LibTypes.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";

uint256 constant SingletonID = 0x060D;

uint256 constant ID = uint256(keccak256("component.MapConfig"));

contract MapConfigComponent is Component {
  uint256 public currentTerrainLength;

  constructor(address world) Component(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](1);
    values = new LibTypes.SchemaValue[](1);

    keys[0] = "value";
    values[0] = LibTypes.SchemaValue.BYTES;
  }

  function getTerrainLength() public view returns (uint256) {
    return currentTerrainLength;
  }

  function set(bytes memory terrainPart) public {
    entityToValue[SingletonID] = abi.encodePacked(entityToValue[SingletonID], terrainPart);
    currentTerrainLength = currentTerrainLength + terrainPart.length;
    IWorld(world).registerComponentValueSet(SingletonID, abi.encode(entityToValue[SingletonID]));
  }

  function getValue() public view returns (bytes memory) {
    return getRawValue(SingletonID);
  }

  function getTerrain(uint256 index) public view returns (bytes1) {
    bytes memory data = getValue();
    return data[index];
  }
}
