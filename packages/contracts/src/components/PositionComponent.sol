// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/Component.sol";

struct Coord {
  uint32 x;
  uint32 y;
}

uint256 constant ID = uint256(keccak256("component.Position"));

contract PositionComponent is Component {
  constructor(address world) Component(world, ID) {}

  function getSchema() public pure override returns (string[] memory keys, LibTypes.SchemaValue[] memory values) {
    keys = new string[](2);
    values = new LibTypes.SchemaValue[](2);

    keys[0] = "x";
    values[0] = LibTypes.SchemaValue.UINT32;

    keys[1] = "y";
    values[1] = LibTypes.SchemaValue.UINT32;
  }

  function set(uint256 entity, Coord calldata value) public virtual {
    set(entity, abi.encode(value));
  }

  function getValue(uint256 entity) public view virtual returns (Coord memory) {
    (uint32 x, uint32 y) = abi.decode(getRawValue(entity), (uint32, uint32));
    return Coord(x, y);
  }

  function getEntitiesWithValue(Coord calldata coord) public view virtual returns (uint256[] memory) {
    return getEntitiesWithValue(abi.encode(coord));
  }
}
