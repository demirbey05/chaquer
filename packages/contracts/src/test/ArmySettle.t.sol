//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;
import { Deploy } from "./Deploy.sol";
import "std-contracts/test/MudTest.t.sol";
import { console } from "forge-std/console.sol";
import { CastleSettleSystem, ID as CastleSettleSystemID } from "systems/CastleSettleSystem.sol";
import { InitSystem, ID as InitSystemID } from "systems/InitSystem.sol";
import { ArmyConfigComponent, ID as ArmyConfigComponentID } from "components/ArmyConfigComponent.sol";
import { PositionComponent, ID as PositionComponentID } from "components/PositionComponent.sol";
import { InitSystem, ID as InitSystemID } from "systems/InitSystem.sol";
import { ArmySettleSystem, ID as ArmySettleSystemID, CoordinatesOutOfBound, NoCastle, WrongTerrainType, TileIsNotEmpty, NoArmyRight, TooFarToSettle, TooManySoldier } from "systems/ArmySettleSystem.sol";
import { ArmyOwnableComponent, ID as ArmyOwnableComponentID } from "components/ArmyOwnableComponent.sol";

contract ArmySettleTest is MudTest {
  constructor() MudTest(new Deploy()) {}

  CastleSettleSystem settleSystem;
  InitSystem initSystem;
  PositionComponent position;
  ArmyOwnableComponent armyOwnable;
  ArmySettleSystem armySettle;
  ArmyConfigComponent armyConfig;

  function setUp() public override {
    // Deploy components and systems
    super.setUp();

    // Assign the systems and components
    settleSystem = CastleSettleSystem(getAddressById(systems, CastleSettleSystemID));
    initSystem = InitSystem(getAddressById(systems, InitSystemID));
    position = PositionComponent(getAddressById(components, PositionComponentID));
    armyConfig = ArmyConfigComponent(getAddressById(components, ArmyConfigComponentID));
    armyOwnable = ArmyOwnableComponent(getAddressById(components, ArmyOwnableComponentID));
    armySettle = ArmySettleSystem(getAddressById(systems, ArmySettleSystemID));

    // Initiialize previous steps
    bytes memory mapData = bytes(vm.readFile("src/test/mock_data/full_data.txt"));
    initSystem.execute(mapData);
  }

  function testCoordinatesOutOfBound() public {
    settleSystem.executeTyped(3, 4);
    vm.expectRevert(CoordinatesOutOfBound.selector);
    armySettle.execute(abi.encode(300, 400, 33, 33, 34));
  }

  function testCannotDeployWithoutCastle() public {
    vm.expectRevert(NoCastle.selector);
    armySettle.execute(abi.encode(15, 13, 33, 33, 34));
  }

  function testWrongTerrainType() public {
    vm.expectRevert(WrongTerrainType.selector);
    armySettle.execute(abi.encode(99, 99, 33, 33, 34));
  }

  function testTileIsNotEmpty() public {
    settleSystem.executeTyped(15, 12);
    armySettle.execute(abi.encode(15, 13, 33, 33, 34));

    vm.startPrank(alice);
    settleSystem.executeTyped(15, 14);
    vm.expectRevert(TileIsNotEmpty.selector);
    armySettle.execute(abi.encode(15, 13, 33, 33, 34));
    vm.stopPrank();
  }

  function testNoArmyRight() public {
    settleSystem.executeTyped(15, 12);
    armySettle.execute(abi.encode(15, 13, 33, 33, 34));
    armySettle.execute(abi.encode(15, 11, 33, 33, 34));
    armySettle.execute(abi.encode(14, 12, 33, 33, 34));
    vm.expectRevert(NoArmyRight.selector);
    armySettle.execute(abi.encode(13, 12, 33, 33, 34));
  }

  function testTooFarToSettle() public {
    settleSystem.executeTyped(15, 12);
    vm.expectRevert(TooFarToSettle.selector);
    armySettle.execute(abi.encode(30, 40, 33, 33, 34));
  }

  function testTooManySoldiers() public {
    settleSystem.executeTyped(30, 41);
    vm.expectRevert(TooManySoldier.selector);
    armySettle.execute(abi.encode(30, 40, 33, 33, 35));
  }

  function testDeployOverCastle() public {
    settleSystem.executeTyped(30, 41);
    vm.expectRevert(TileIsNotEmpty.selector);
    armySettle.execute(abi.encode(30, 41, 33, 33, 34));
  }
}
