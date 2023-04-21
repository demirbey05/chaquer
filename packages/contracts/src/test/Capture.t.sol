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
import { CastleOwnableComponent, ID as CastleOwnableComponentID } from "components/CastleOwnableComponent.sol";
import { CaptureSystem, ID as CaptureSystemID, CaptureSystem__NoAuthorization, CaptureSystem__TooFarToAttack, CaptureSystem__FriendFireNotAllowed } from "systems/CaptureSystem.sol";

contract CaptureTest is MudTest {
  PositionComponent position;
  InitSystem initSystem;
  CastleSettleSystem castleSettle;
  ArmyConfigComponent armyConfig;
  ArmyOwnableComponent armyOwnable;
  ArmySettleSystem armySettle;
  CastleOwnableComponent castleOwnable;
  CaptureSystem captureSystem;

  constructor() MudTest(new Deploy()) {}

  function setUp() public override {
    // Deploy components and systems
    super.setUp();

    // Assign the systems and components

    position = PositionComponent(getAddressById(components, PositionComponentID));
    initSystem = InitSystem(getAddressById(systems, InitSystemID));
    armyConfig = ArmyConfigComponent(getAddressById(components, ArmyConfigComponentID));
    armyOwnable = ArmyOwnableComponent(getAddressById(components, ArmyOwnableComponentID));
    armySettle = ArmySettleSystem(getAddressById(systems, ArmySettleSystemID));
    castleOwnable = CastleOwnableComponent(getAddressById(components, CastleOwnableComponentID));
    castleSettle = CastleSettleSystem(getAddressById(systems, CastleSettleSystemID));
    captureSystem = CaptureSystem(getAddressById(systems, CaptureSystemID));

    // Initiialize previous steps
    bytes memory mapData = bytes(vm.readFile("src/test/mock_data/full_data.txt"));
    initSystem.execute(mapData);
  }

  //Auxiliary Functions
  function deployArmy(
    address deployer,
    uint32 coord_x,
    uint32 coord_y,
    uint32 numSwordsman,
    uint32 numArcher,
    uint32 numCavalry
  ) internal returns (uint256 armyID) {
    vm.startPrank(deployer);
    castleSettle.executeTyped(coord_x - 1, coord_y);
    armySettle.execute(abi.encode(coord_x, coord_y, numSwordsman, numArcher, numCavalry));
    armyID = armyOwnable.getEntitiesWithValue(deployer)[0];
    vm.stopPrank();
  }

  function deployArmyWithoutCastle(
    address deployer,
    uint32 coord_x,
    uint32 coord_y,
    uint32 numSwordsman,
    uint32 numArcher,
    uint32 numCavalry
  ) internal returns (uint256 armyID) {
    vm.startPrank(deployer);
    armySettle.execute(abi.encode(coord_x, coord_y, numSwordsman, numArcher, numCavalry));
    armyID = armyOwnable.getEntitiesWithValue(deployer)[0];
    vm.stopPrank();
  }

  function deployCastle(address deployer, uint32 coord_x, uint32 coord_y) internal returns (uint256 castleID) {
    vm.startPrank(deployer);
    castleSettle.executeTyped(coord_x, coord_y);
    castleID = castleOwnable.getEntitiesWithValue(deployer)[0];
    vm.stopPrank();
  }

  function testNoAuthorization() public {
    uint256 castleId = deployCastle(bob, 35, 34);
    uint256 armyId = deployArmy(alice, 34, 34, 32, 34, 34);
    vm.startPrank(eve);
    vm.expectRevert(CaptureSystem__NoAuthorization.selector);
    captureSystem.execute(abi.encode(castleId, armyId));
  }

  function testFailInvalidArmyID() public {
    uint256 castleId = deployCastle(bob, 35, 34);
    uint256 armyId = deployArmy(alice, 34, 34, 32, 34, 34);
    vm.startPrank(alice);
    captureSystem.execute(abi.encode(500, armyId));
    vm.stopPrank();
  }

  function testFailInvalidCastleID() public {
    uint256 castleId = deployCastle(bob, 35, 34);
    uint256 armyId = deployArmy(alice, 34, 34, 32, 34, 34);
    vm.startPrank(alice);
    captureSystem.execute(abi.encode(castleId + 100, armyId));
    vm.stopPrank();
  }

  function testFriendlyFire() public {
    uint256 castleID = deployCastle(alice, 33, 34);
    uint256 armyID = deployArmyWithoutCastle(alice, 32, 34, 33, 33, 34);
    vm.startPrank(alice);
    vm.expectRevert(CaptureSystem__FriendFireNotAllowed.selector);
    captureSystem.execute(abi.encode(castleID, armyID));
  }

  function testTooFarToAttack() public {
    uint256 castleID = deployCastle(alice, 33, 34);
    uint256 armyID = deployArmy(bob, 36, 36, 32, 34, 34);
    vm.startPrank(bob);
    vm.expectRevert(CaptureSystem__TooFarToAttack.selector);
    captureSystem.execute(abi.encode(castleID, armyID));
  }

  function testSiegeOne() public {
    uint256 armyID = deployArmy(bob, 36, 36, 19, 67, 12); // Castle at 35,36
    uint256 castleID = deployCastle(alice, 36, 37);
    deployArmyWithoutCastle(alice, 35, 37, 44, 15, 25);
    vm.startPrank(bob);
    bytes memory data = captureSystem.execute(abi.encode(castleID, armyID));
    assertEq(2, abi.decode(data, (uint)));
    vm.stopPrank();
  }

  function testSiegeTwo() public {
    uint256 armyID = deployArmy(bob, 36, 36, 62, 20, 8); // Castle at 35,36
    uint256 castleID = deployCastle(alice, 36, 37);
    deployArmyWithoutCastle(alice, 35, 37, 66, 14, 11);
    vm.startPrank(bob);
    bytes memory data = captureSystem.execute(abi.encode(castleID, armyID));
    assertEq(2, abi.decode(data, (uint)));
    vm.stopPrank();
  }

  function testSiegeThree() public {
    uint256 armyID = deployArmy(bob, 36, 36, 53, 21, 2); // Castle at 35,36
    uint256 castleID = deployCastle(alice, 36, 37);
    deployArmyWithoutCastle(alice, 35, 37, 24, 28, 43);
    vm.startPrank(bob);
    bytes memory data = captureSystem.execute(abi.encode(castleID, armyID));
    assertEq(2, abi.decode(data, (uint)));
    vm.stopPrank();
  }

  function testSiegeFour() public {
    uint256 armyID = deployArmy(bob, 36, 36, 67, 26, 6); // Castle at 35,36
    uint256 castleID = deployCastle(alice, 36, 37);
    deployArmyWithoutCastle(alice, 35, 37, 50, 19, 14);
    vm.startPrank(bob);
    bytes memory data = captureSystem.execute(abi.encode(castleID, armyID));
    assertEq(1, abi.decode(data, (uint)));
    vm.stopPrank();
  }

  function testSiegeFive() public {
    uint256 armyID = deployArmy(bob, 36, 36, 97, 2, 0); // Castle at 35,36
    uint256 castleID = deployCastle(alice, 36, 37);
    deployArmyWithoutCastle(alice, 35, 37, 94, 3, 1);
    vm.startPrank(bob);
    bytes memory data = captureSystem.execute(abi.encode(castleID, armyID));
    assertEq(1, abi.decode(data, (uint)));
    vm.stopPrank();
  }

  function testMultipleArmySiegeOne() public {
    uint256 armyID = deployArmy(bob, 36, 36, 97, 2, 0); // Castle at 35,36
    uint256 castleID = deployCastle(alice, 36, 37);
    deployArmyWithoutCastle(alice, 35, 37, 47, 3, 1);
    deployArmyWithoutCastle(alice, 34, 37, 47, 0, 0);
    vm.startPrank(bob);
    bytes memory data = captureSystem.execute(abi.encode(castleID, armyID));
    assertEq(1, abi.decode(data, (uint)));
    vm.stopPrank();
  }

  function testMultipleArmySiegeTwo() public {
    uint256 armyID = deployArmy(bob, 36, 36, 19, 67, 12); // Castle at 35,36
    uint256 castleID = deployCastle(alice, 36, 37);
    deployArmyWithoutCastle(alice, 35, 37, 44, 15, 0);
    deployArmyWithoutCastle(alice, 34, 37, 0, 0, 25);
    vm.startPrank(bob);
    bytes memory data = captureSystem.execute(abi.encode(castleID, armyID));
    assertEq(2, abi.decode(data, (uint)));
    vm.stopPrank();
  }
}
