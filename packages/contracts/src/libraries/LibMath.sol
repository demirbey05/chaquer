// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { Coord } from "components/PositionComponent.sol";

library LibMath {
  function manhattan(Coord memory a, Coord memory b) internal pure returns (uint32) {
    uint32 dx = a.x > b.x ? a.x - b.x : b.x - a.x;
    uint32 dy = a.y > b.y ? a.y - b.y : b.y - a.y;
    return dx + dy;
  }
}
