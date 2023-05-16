//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { Deploy } from "./Deploy.sol";
import "std-contracts/test/MudTest.t.sol";
import { console } from "forge-std/console.sol";
import { MapConfigComponent, ID as MapConfigComponentID } from "components/MapConfigComponent.sol";
import { InitSystem, ID as InitSystemID } from "systems/InitSystem.sol";

contract MapInitTest is MudTest {
  constructor() MudTest(new Deploy()) {}

  event ComponentValueSet(uint256 indexed componentId, address indexed component, uint256 indexed entity, bytes data);

  function testTerrainLengthShouldMatch() public {
    InitSystem initSystem = InitSystem(getAddressById(systems, InitSystemID));
    MapConfigComponent mapConfig = MapConfigComponent(getAddressById(components, MapConfigComponentID));

    bytes memory map1 = bytes(vm.readFile("src/test/mock_data/full_data.txt"));
    initSystem.execute(map1);

    bytes memory valueAtContract = mapConfig.getValue();

    assertEq(valueAtContract.length, 2500);
    console.log(valueAtContract.length);
  }

  function testWhenMoreDataInvolved() public {
    bytes memory exceedData = hex"0101010101";
    InitSystem initSystem = InitSystem(getAddressById(systems, InitSystemID));
    MapConfigComponent mapConfig = MapConfigComponent(getAddressById(components, MapConfigComponentID));

    bytes memory map1 = bytes(vm.readFile("src/test/mock_data/full_data.txt"));
    initSystem.execute(map1);
    initSystem.execute(exceedData);
    bytes memory valueAtContract = mapConfig.getValue();

    assertEq(valueAtContract.length, 2500);
    console.log("Test 2 ");
    console.log(valueAtContract.length);
  }
}
