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

  // Auxiliary Functions

  function settleAnArmyAroundCoords(
    uint32 coord_x,
    uint32 coord_y
  ) public returns (uint256 armyOne, uint256 armyTwo, uint256 armyThree) {
    settleSystem.executeTyped(coord_x, coord_y);
    armySettle.execute(abi.encode(coord_x - 1, coord_y, 33, 33, 34));
    armySettle.execute(abi.encode(coord_x + 1, coord_y, 33, 33, 34));
    armySettle.execute(abi.encode(coord_x, coord_y - 1, 33, 33, 34));

    armyOne = uint256(keccak256(abi.encodePacked(coord_x - 1, coord_y, "Army", alice)));
    armyTwo = uint256(keccak256(abi.encodePacked(coord_x + 1, coord_y, "Army", alice)));
    armyThree = uint256(keccak256(abi.encodePacked(coord_x, coord_y - 1, "Army", alice)));
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
    settleAnArmyAroundCoords(15, 12);
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

  function testSuccessfulDeployment() public {
    vm.startPrank(alice);
    (uint256 armyOne, uint256 armyTwo, uint256 armyThree) = settleAnArmyAroundCoords(30, 42);

    vm.stopPrank();

    assertEq(armyOwnable.getValue(armyOne), alice);
    assertEq(armyOwnable.getValue(armyTwo), alice);
    assertEq(armyOwnable.getValue(armyThree), alice);
  }
}
