import {
  EntityID,
  OverridableComponent,
  Type,
  World,
  getComponentEntities,
  getComponentValue,
} from "@latticexyz/recs";

export interface Coord {
  x: string;
  y: string;
}

export const findIDFromPosition = (
  coordinate: Coord,
  posComponent: OverridableComponent<
    {
      x: Type.Number;
      y: Type.Number;
    },
    {
      contractId: string;
    },
    undefined
  >,
  world: World
): EntityID | null => {
  let keyRes: EntityID | null = null;
  for (const entity of getComponentEntities(posComponent)) {
    const val = getComponentValue(posComponent, entity);
    if (val?.x === Number(coordinate.x) && val.y === Number(coordinate.y)) {
      world.entityToIndex.forEach((value, key) => {
        if (value === entity) {
          keyRes = key;
        }
      });
    }
  }
  return keyRes;
};
