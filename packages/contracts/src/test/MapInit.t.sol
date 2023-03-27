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

  function testEnterTerrain() public {
    InitSystem initSystem = InitSystem(getAddressById(systems, InitSystemID));
    MapConfigComponent mapConfig = MapConfigComponent(getAddressById(components, MapConfigComponentID));
    console.log(mapConfig.getTerrainLength());
    console.log("sdasad");
    bytes memory map1 = bytes(vm.readFile("scripts/mock_data/data1.txt"));
    initSystem.execute(map1);
    bytes memory map2 = bytes(vm.readFile("scripts/mock_data/my_file.txt"));
    initSystem.execute(map2);

    assertEq(mapConfig.getTerrain(5003), map2[3]);
    assertEq(mapConfig.getTerrain(10), map1[10]);
    assertEq(mapConfig.getTerrain(9999), map2[4999]);
  }

  function testTerrainLengthShouldMatch() public {
    InitSystem initSystem = InitSystem(getAddressById(systems, InitSystemID));
    MapConfigComponent mapConfig = MapConfigComponent(getAddressById(components, MapConfigComponentID));

    bytes memory map1 = bytes(vm.readFile("scripts/mock_data/data1.txt"));
    initSystem.execute(map1);
    bytes memory map2 = bytes(vm.readFile("scripts/mock_data/my_file.txt"));
    initSystem.execute(map2);

    bytes memory valueAtContract = mapConfig.getValue();

    assertEq(valueAtContract.length, 10000);
    console.log(valueAtContract.length);
  }

  function testFailWhenMoreDataInvolved() public {
    bytes memory exceedData = hex"0101010101";
    InitSystem initSystem = InitSystem(getAddressById(systems, InitSystemID));
    MapConfigComponent mapConfig = MapConfigComponent(getAddressById(components, MapConfigComponentID));

    bytes memory map1 = bytes(vm.readFile("scripts/mock_data/data1.txt"));
    initSystem.execute(map1);
    bytes memory map2 = bytes(vm.readFile("scripts/mock_data/my_file.txt"));
    initSystem.execute(map2);
    initSystem.execute(exceedData);
    bytes memory valueAtContract = mapConfig.getValue();

    assertEq(valueAtContract.length, 10000 + exceedData.length);
    console.log("Test 2 ");
    console.log(valueAtContract.length);
  }
}
