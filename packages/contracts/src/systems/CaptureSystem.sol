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

  function findSurroundedArmies(
    uint256 castleID,
    uint256[] memory ownerArmies,
    PositionComponent position
  ) internal returns (uint256[] memory) {
    uint256[] memory ownerArmiesSurroundCastle = new uint256[](ownerArmies.length);
    uint current = 0;
    Coord memory castleCoord = position.getValue(castleID);
    console.log(ownerArmies.length);

    for (uint i = 0; i < ownerArmies.length; i++) {
      if (LibMath.manhattan(position.getValue(ownerArmies[i]), castleCoord) <= 3) {
        console.log("One is added");
        ownerArmiesSurroundCastle[current] = ownerArmies[i];
        current++;
      }
    }
    return ownerArmiesSurroundCastle;
  }

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

    address castleOwner = castleOwnable.getValue(castleID);
    address armyOwner = armyOwnable.getValue(armyID);

    uint256[] memory ownerArmies = armyOwnable.getEntitiesWithValue(castleOwner);
    uint256[] memory ownerArmiesSurroundCastle = findSurroundedArmies(castleID, ownerArmies, position);
    console.log("All Army length is ");
    console.log(ownerArmies.length);

    console.log("Close Army length is ");
    console.log(ownerArmiesSurroundCastle.length);
    bytes memory warResult = LibAttack.warCaptureCastle(armyID, ownerArmiesSurroundCastle, armyConfig, armyOwnable);

    (uint256 result, ) = abi.decode(warResult, (uint256, int32));
    if (result == 1) {
      castleOwnable.set(castleID, armyOwner);
      console.log("Siege is successful");

      // Destroy all the army which belongs to castle owner

      uint256[] memory castleOwnerArmies = armyOwnable.getEntitiesWithValue(castleOwner);

      for (uint i = 0; i < castleOwnerArmies.length; i++) {
        armyOwnable.remove(castleOwnerArmies[i]);
        armyConfig.remove(castleOwnerArmies[i]);
      }

      return abi.encode(1);
    } else if (result == 0) {
      return abi.encode(0);
    }
    console.log("Siege is failed");
    return abi.encode(2);
  }
}
