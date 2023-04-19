//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { Deploy } from "./Deploy.sol";
import "std-contracts/test/MudTest.t.sol";
import { console } from "forge-std/console.sol";
import { CastleSettleSystem, ID as CastleSettleSystemID } from "systems/CastleSettleSystem.sol";
import { InitSystem, ID as InitSystemID } from "systems/InitSystem.sol";
import { PositionComponent, ID as PositionComponentID } from "components/PositionComponent.sol";
import { ArmyConfigComponent, ID as ArmyConfigComponentID, ArmyConfig } from "components/ArmyConfigComponent.sol";
import { ArmyOwnableComponent, ID as ArmyOwnableComponentID } from "components/ArmyOwnableComponent.sol";
import { ArmySettleSystem, ID as ArmySettleSystemID } from "systems/ArmySettleSystem.sol";
import { MoveArmySystem, ID as MoveArmySystemID, MoveArmy__NoAuthorized, MoveArmy__TooFar, MoveArmy__TileIsNotEmpty } from "systems/MoveArmySystem.sol";
import { AttackSystem, ID as AttackSystemID, AttackSystem__ArmyNotBelongYou, AttackSystem__TooAwayToAttack, AttackSystem__NoArmy } from "systems/AttackSystem.sol";
import { LibAttack } from "libraries/LibAttack.sol";

contract ArmyMoveAndAttackTest is MudTest {
  constructor() MudTest(new Deploy()) {}

  CastleSettleSystem settleSystem;
  InitSystem initSystem;
  PositionComponent position;
  ArmyOwnableComponent armyOwnable;
  ArmySettleSystem armySettle;
  ArmyConfigComponent armyConfig;
  MoveArmySystem moveArmy;
  AttackSystem attackSystem;

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
    moveArmy = MoveArmySystem(getAddressById(systems, MoveArmySystemID));
    attackSystem = AttackSystem(getAddressById(systems, AttackSystemID));

    // Initiialize previous steps
    bytes memory mapData = bytes(vm.readFile("src/test/mock_data/full_data.txt"));
    initSystem.execute(mapData);
  }

  // Move Tests

  function testMoveAnotherArmy() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(38, 40);
    armySettle.execute(abi.encode(37, 40, 33, 33, 34));
    vm.stopPrank();
    vm.startPrank(bob);
    uint256 foreignArmy = armyOwnable.getEntitiesWithValue(alice)[0];
    vm.expectRevert(MoveArmy__NoAuthorized.selector);
    moveArmy.execute(abi.encode(foreignArmy, 38, 40));
    vm.stopPrank();
  }

  function testMoveTooFar() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(38, 40);
    armySettle.execute(abi.encode(37, 40, 33, 33, 34));
    uint256 armyID = armyOwnable.getEntitiesWithValue(alice)[0];
    vm.expectRevert(MoveArmy__TooFar.selector);
    moveArmy.execute(abi.encode(armyID, 41, 40));
    vm.stopPrank();
  }

  function testTileIsNotEmpty() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(38, 40);
    armySettle.execute(abi.encode(37, 40, 33, 33, 34));
    uint256 armyID = armyOwnable.getEntitiesWithValue(alice)[0];
    vm.expectRevert(MoveArmy__TileIsNotEmpty.selector);
    moveArmy.execute(abi.encode(armyID, 38, 40));
    vm.stopPrank();
  }

  function testTileIsNotEmptyArmy() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(38, 40);
    armySettle.execute(abi.encode(37, 40, 33, 33, 34));
    vm.stopPrank();
    vm.startPrank(bob);
    settleSystem.executeTyped(39, 40);
    armySettle.execute(abi.encode(38, 41, 33, 33, 34));
    uint256 armyID = armyOwnable.getEntitiesWithValue(bob)[0];
    vm.expectRevert(MoveArmy__TileIsNotEmpty.selector);
    moveArmy.execute(abi.encode(armyID, 37, 40));

    vm.stopPrank();
  }

  function testSuccessfulTwoMovement() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(38, 40);
    armySettle.execute(abi.encode(37, 40, 33, 33, 34));
    armySettle.execute(abi.encode(37, 41, 33, 33, 34));
    uint256[] memory armies = armyOwnable.getEntitiesWithValue(alice);
    moveArmy.execute(abi.encode(armies[0], 39, 40));
    moveArmy.execute(abi.encode(armies[1], 39, 41));

    assertEq(position.getValue(armies[0]).x, 39);
    assertEq(position.getValue(armies[0]).y, 40);
    assertEq(position.getValue(armies[1]).x, 39);
    assertEq(position.getValue(armies[1]).y, 41);
  }

  // Attack System Tests

  function testArmyNotBelongYou() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(34, 35);
    armySettle.execute(abi.encode(33, 35, 33, 33, 34));
    uint256 armyOneID = armyOwnable.getEntitiesWithValue(alice)[0];
    vm.stopPrank();
    vm.startPrank(bob);
    settleSystem.executeTyped(35, 35);
    armySettle.execute(abi.encode(33, 36, 33, 33, 34));
    uint256 armyTwoID = armyOwnable.getEntitiesWithValue(bob)[0];
    vm.stopPrank();
    vm.expectRevert(AttackSystem__ArmyNotBelongYou.selector);
    attackSystem.execute(abi.encode(armyOneID, armyTwoID));
  }

  function testTooAwayToAttack() public {
    vm.startPrank(bob);
    settleSystem.executeTyped(34, 35);
    armySettle.execute(abi.encode(33, 35, 33, 33, 34));
    vm.stopPrank();

    vm.startPrank(alice);
    settleSystem.executeTyped(38, 38);
    armySettle.execute(abi.encode(37, 38, 33, 33, 34));
    uint256 armyOneID = armyOwnable.getEntitiesWithValue(alice)[0];
    uint256 armyTwoID = armyOwnable.getEntitiesWithValue(bob)[0];

    vm.expectRevert(AttackSystem__TooAwayToAttack.selector);
    attackSystem.execute(abi.encode(armyOneID, armyTwoID));
    vm.stopPrank();
  }

  function testNoArmy() public {
    vm.startPrank(alice);
    settleSystem.executeTyped(34, 35);
    armySettle.execute(abi.encode(33, 35, 33, 33, 34));
    uint256 armyOneID = armyOwnable.getEntitiesWithValue(alice)[0];
    vm.expectRevert(AttackSystem__NoArmy.selector);
    attackSystem.execute(abi.encode(armyOneID, 50000));
    vm.stopPrank();
  }

  // Auxiliary functions

  function deployArmy(
    address deployer,
    uint32 coord_x,
    uint32 coord_y,
    uint32 numSwordsman,
    uint32 numArcher,
    uint32 numCavalry
  ) internal returns (uint256 armyID) {
    vm.startPrank(deployer);
    settleSystem.executeTyped(coord_x - 1, coord_y);
    armySettle.execute(abi.encode(coord_x, coord_y, numSwordsman, numArcher, numCavalry));
    armyID = armyOwnable.getEntitiesWithValue(deployer)[0];
    vm.stopPrank();
  }

  function testArmyFightOne() public {
    uint256 armyOne = deployArmy(alice, 33, 34, 19, 67, 12);
    uint256 armyTwo = deployArmy(bob, 35, 34, 44, 15, 25);

    vm.startPrank(alice);
    ArmyConfig memory oldConfig = armyConfig.getValue(armyTwo);

    bytes memory winner = attackSystem.execute(abi.encode(armyOne, armyTwo));
    (uint256 winnerid, int32 score) = abi.decode(winner, (uint256, int32));

    ArmyConfig memory newConfig = armyConfig.getValue(armyTwo);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 2);
  }

  function testArmyFightTwo() public {
    uint256 armyOne = deployArmy(alice, 33, 34, 62, 20, 8);
    uint256 armyTwo = deployArmy(bob, 35, 34, 66, 14, 11);

    vm.startPrank(alice);
    ArmyConfig memory oldConfig = armyConfig.getValue(armyTwo);

    bytes memory winner = attackSystem.execute(abi.encode(armyOne, armyTwo));
    (uint256 winnerid, int32 score) = abi.decode(winner, (uint256, int32));

    ArmyConfig memory newConfig = armyConfig.getValue(armyTwo);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 2);
  }

  function testArmyFightThree() public {
    uint256 armyOne = deployArmy(alice, 33, 34, 53, 21, 2);
    uint256 armyTwo = deployArmy(bob, 35, 34, 24, 28, 43);

    vm.startPrank(alice);
    ArmyConfig memory oldConfig = armyConfig.getValue(armyTwo);

    bytes memory winner = attackSystem.execute(abi.encode(armyOne, armyTwo));
    (uint256 winnerid, int32 score) = abi.decode(winner, (uint256, int32));

    ArmyConfig memory newConfig = armyConfig.getValue(armyTwo);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 2);
  }

  function testArmyFightFour() public {
    uint256 armyOne = deployArmy(alice, 33, 34, 67, 26, 6);
    uint256 armyTwo = deployArmy(bob, 35, 34, 50, 19, 14);

    vm.startPrank(alice);
    ArmyConfig memory oldConfig = armyConfig.getValue(armyOne);

    bytes memory winner = attackSystem.execute(abi.encode(armyOne, armyTwo));
    (uint256 winnerid, int32 score) = abi.decode(winner, (uint256, int32));

    ArmyConfig memory newConfig = armyConfig.getValue(armyOne);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 1);
  }

  function testArmyFightFive() public {
    uint256 armyOne = deployArmy(alice, 33, 34, 97, 2, 0);
    uint256 armyTwo = deployArmy(bob, 35, 34, 94, 3, 1);

    vm.startPrank(alice);
    ArmyConfig memory oldConfig = armyConfig.getValue(armyOne);

    bytes memory winner = attackSystem.execute(abi.encode(armyOne, armyTwo));
    (uint256 winnerid, int32 score) = abi.decode(winner, (uint256, int32));

    ArmyConfig memory newConfig = armyConfig.getValue(armyOne);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 1);
  }

  function testMoveAndAttack() public {
    uint256 armyOne = deployArmy(alice, 33, 34, 97, 2, 0);
    uint256 armyTwo = deployArmy(bob, 40, 40, 94, 3, 1);
    assertEq(armyOwnable.getEntitiesWithValue(bob).length, 1);

    vm.startPrank(alice);
    moveArmy.execute(abi.encode(armyOne, 34, 35));
    moveArmy.execute(abi.encode(armyOne, 35, 36));
    moveArmy.execute(abi.encode(armyOne, 36, 37));
    moveArmy.execute(abi.encode(armyOne, 37, 38));
    moveArmy.execute(abi.encode(armyOne, 39, 38));
    moveArmy.execute(abi.encode(armyOne, 40, 39));

    ArmyConfig memory oldConfig = armyConfig.getValue(armyOne);

    bytes memory winner = attackSystem.execute(abi.encode(armyOne, armyTwo));
    (uint256 winnerid, int32 score) = abi.decode(winner, (uint256, int32));

    ArmyConfig memory newConfig = armyConfig.getValue(armyOne);

    assertEq(newConfig.numSwordsman, oldConfig.numSwordsman / 2);
    assertEq(newConfig.numArcher, oldConfig.numArcher / 2);
    assertEq(newConfig.numCavalry, oldConfig.numCavalry / 2);
    assertEq(winnerid, 1);
    assertEq(armyOwnable.getEntitiesWithValue(bob).length, 0);
  }
}
