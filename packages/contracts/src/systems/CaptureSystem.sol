//SPDX-Licence-Identifier:MIT

pragma solidity ^0.8.0;

import { System, IWorld } from "solecs/System.sol";
import { getAddressById } from "solecs/utils.sol";
import { LibMath } from "libraries/LibMath.sol";
import { ArmyOwnableComponent, ID as ArmyOwnableComponentID } from "components/ArmyOwnableComponent.sol";
import { ArmyConfigComponent, ID as ArmyConfigComponentID, ArmyConfig } from "components/ArmyConfigComponent.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "components/PositionComponent.sol";
import { CastleOwnableComponent, ID as CastleOwnableComponentID } from "components/CastleOwnableComponent.sol";
import "solecs/LibQuery.sol";
import { LibAttack } from "libraries/LibAttack.sol";
import { console } from "forge-std/console.sol";
import { LibMath } from "libraries/LibMath.sol";

uint256 constant ID = uint256(keccak256("system.Capture"));

error CaptureSystem__TooFarToAttack();
error CaptureSystem__NoAuthorization();
error CaptureSystem__FriendFireNotAllowed();

contract CaptureSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory args) public returns (bytes memory) {
    (uint256 castleID, uint256 armyID) = abi.decode(args, (uint, uint));
    return executeTyped(castleID, armyID);
  }

  function executeTyped(uint256 castleID, uint256 armyID) public returns (bytes memory) {
    ArmyOwnableComponent armyOwnable = ArmyOwnableComponent(getAddressById(components, ArmyOwnableComponentID));
    ArmyConfigComponent armyConfig = ArmyConfigComponent(getAddressById(components, ArmyConfigComponentID));
    PositionComponent position = PositionComponent(getAddressById(components, PositionComponentID));
    CastleOwnableComponent castleOwnable = CastleOwnableComponent(getAddressById(components, CastleOwnableComponentID));

    if (armyOwnable.getValue(armyID) == castleOwnable.getValue(castleID)) {
      revert CaptureSystem__FriendFireNotAllowed();
    }
    if (armyOwnable.getValue(armyID) != msg.sender) {
      revert CaptureSystem__NoAuthorization();
    }
    uint32 distanceBetween = LibMath.manhattan(position.getValue(castleID), position.getValue(armyID));

    if (!(distanceBetween <= 3)) {
      revert CaptureSystem__TooFarToAttack();
    }

    Coord memory castleCoord = position.getValue(castleID);
    address castleOwner = castleOwnable.getValue(castleID);
    address armyOwner = armyOwnable.getValue(armyID);

    uint256[] memory ownerArmies = armyOwnable.getEntitiesWithValue(castleOwner);

    console.log("Entities length is ");
    console.log(ownerArmies.length);
    bytes memory warResult;
    for (uint i = 0; i < ownerArmies.length; i++) {
      if (LibMath.manhattan(castleCoord, position.getValue(ownerArmies[i])) > 2) {
        console.log("Continued");
        continue;
      }
      warResult = LibAttack.warBetweenArmies(armyID, ownerArmies[i], armyConfig, armyOwnable);

      (uint256 winnerid, int32 score) = abi.decode(warResult, (uint256, int32));
      if (winnerid == 2) {
        console.log("Siege is failed");
        console.logInt(score);
        return abi.encode(1);
      }
    }

    castleOwnable.set(castleID, armyOwner);
    console.log("Siege is successful");
    return abi.encode(2);
  }
}
