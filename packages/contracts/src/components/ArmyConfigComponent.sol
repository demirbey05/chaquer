//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { BareComponent } from "solecs/BareComponent.sol";
import { LibTypes } from "solecs/LibTypes.sol";
uint256 constant ID = uint256(keccak256("component.ArmyConfig"));

struct ArmyConfig {
  uint32 numSwordsman;
  uint32 numArcher;
  uint32 numCavalry;
}

contract ArmyConfigComponent is BareComponent {
  constructor(address world) BareComponent(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](3);
    values = new LibTypes.SchemaValue[](3);

    keys[0] = "numSwordsman";
    values[0] = LibTypes.SchemaValue.UINT32;

    keys[1] = "numArcher";
    values[1] = LibTypes.SchemaValue.UINT32;

    keys[2] = "numCavalry";
    values[2] = LibTypes.SchemaValue.UINT32;
  }

  function set(uint256 entityID, ArmyConfig memory armyConfig) public {
    set(entityID, abi.encode(armyConfig.numSwordsman, armyConfig.numArcher, armyConfig.numCavalry));
  }

  function getValue(uint256 entityID) public view returns (ArmyConfig memory) {
    (uint32 numSwordsman, uint32 numArcher, uint32 numCavalry) = abi.decode(
      getRawValue(entityID),
      (uint32, uint32, uint32)
    );
    return ArmyConfig(numSwordsman, numArcher, numCavalry);
  }
}
