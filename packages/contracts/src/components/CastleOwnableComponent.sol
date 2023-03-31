//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;

import { AddressComponent } from "std-contracts/components/AddressComponent.sol";

uint256 constant ID = uint256(keccak256("component.CastleOwnable"));

contract CastleOwnableComponent is AddressComponent {
  constructor(address world) AddressComponent(world, ID) {}
}
