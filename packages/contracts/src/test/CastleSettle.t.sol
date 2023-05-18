//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { Deploy } from "./Deploy.sol";
import "std-contracts/test/MudTest.t.sol";
import { console } from "forge-std/console.sol";
import { CastleSettleSystem, ID as CastleSettleSystemID, CastleSettle__MapIsNotReady, CastleSettle__CoordinatesOutOfBound, CastleSettle__TileIsNotEmpty, CastleSettle__WrongTerrainType, CastleSettle__NoCastleRight } from "systems/CastleSettleSystem.sol";
import { MapConfigComponent, ID as MapConfigComponentID } from "components/MapConfigComponent.sol";
import { InitSystem, ID as InitSystemID } from "systems/InitSystem.sol";
import { CastleOwnableComponent, ID as CastleOwnableComponentID } from "components/CastleOwnableComponent.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "components/PositionComponent.sol";

contract CastleSettleTest is MudTest {
  constructor() MudTest(new Deploy()) {}

  MapConfigComponent mapConfig;
  CastleSettleSystem settleSystem;
  InitSystem initSystem;
  CastleOwnableComponent castleOwnable;
  PositionComponent position;

  function setUp() public override {
    super.setUp();
    settleSystem = CastleSettleSystem(getAddressById(systems, CastleSettleSystemID));
    mapConfig = MapConfigComponent(getAddressById(components, MapConfigComponentID));
    initSystem = InitSystem(getAddressById(systems, InitSystemID));
    castleOwnable = CastleOwnableComponent(getAddressById(components, CastleOwnableComponentID));
    position = PositionComponent(getAddressById(components, PositionComponentID));
  }

  function testMapIsNotReady() public {
    vm.expectRevert(CastleSettle__MapIsNotReady.selector);
    settleSystem.executeTyped(3, 5);
  }

  function testCoordinatesOutOfBound() public {
    bytes memory mapData = bytes(vm.readFile("src/test/mock_data/full_data.txt"));
    initSystem.execute(mapData);
    vm.expectRevert(CastleSettle__CoordinatesOutOfBound.selector);
    settleSystem.executeTyped(300, 400);
  }

  function testTileIsNotEmpty() public {
    bytes memory mapData = bytes(vm.readFile("src/test/mock_data/full_data.txt"));
    initSystem.execute(mapData);
    settleSystem.executeTyped(3, 4);
    vm.startPrank(alice);
    vm.expectRevert(CastleSettle__TileIsNotEmpty.selector);
    settleSystem.executeTyped(3, 4);
    vm.stopPrank();
  }

  function testWrongTerrainType() public {
    bytes memory mapData = bytes(vm.readFile("src/test/mock_data/full_data.txt"));
    mapData[5] = hex"03";
    initSystem.execute(mapData);
    vm.expectRevert(CastleSettle__WrongTerrainType.selector);
    settleSystem.executeTyped(0, 5);
    vm.stopPrank();
  }

  function testNoCastleRight() public {
    bytes memory mapData = bytes(vm.readFile("src/test/mock_data/full_data.txt"));
    initSystem.execute(mapData);
    settleSystem.executeTyped(3, 4);
    vm.expectRevert(CastleSettle__NoCastleRight.selector);
    settleSystem.executeTyped(5, 7);
    vm.stopPrank();
  }

  function testTwoSuccessCastleSettle() public {
    bytes memory mapData = bytes(vm.readFile("src/test/mock_data/full_data.txt"));
    initSystem.execute(mapData);

    //Castle Settlement for Alice
    vm.startPrank(alice);
    settleSystem.executeTyped(3, 4);
    uint256 castleOne = castleOwnable.getEntitiesWithValue(alice)[0];
    Coord memory coordOne = position.getValue(castleOne);
    assertEq(alice, castleOwnable.getValue(castleOne));
    assertEq(coordOne.x, 3);
    assertEq(coordOne.y, 4);
    vm.stopPrank();

    //Castle Settlement for Bob
    vm.startPrank(bob);
    settleSystem.executeTyped(10, 2);
    uint256 castleTwo = castleOwnable.getEntitiesWithValue(bob)[0];
    Coord memory coordTwo = position.getValue(castleTwo);
    assertEq(bob, castleOwnable.getValue(castleTwo));
    assertEq(coordTwo.x, 10);
    assertEq(coordTwo.y, 2);
    vm.stopPrank();
  }
}
