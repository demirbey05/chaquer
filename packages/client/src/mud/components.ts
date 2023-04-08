import { world } from "./world";
import { overridableComponent, Type, defineComponent } from "@latticexyz/recs";
import {
  defineStringComponent,
  defineCoordComponent,
} from "@latticexyz/std-client";

export const contractComponents = {
  CastleOwnable: defineStringComponent(world, {
    id: "CastleOwnable",
    metadata: { contractId: "component.CastleOwnable" },
  }),
  ArmyConfig: defineComponent(
    world,
    {
      numSwordsman: Type.Number,
      numArcher: Type.Number,
      numCavalry: Type.Number,
    },
    {
      id: "ArmyConfig",
      metadata: { contractId: "component.ArmyConfig" },
    }
  ),
  ArmyOwnable: defineStringComponent(world, {
    id: "ArmyOwnable",
    metadata: { contractId: "component.ArmyOwnable" },
  }),
  MapConfig: defineStringComponent(world, {
    id: "MapConfig",
    metadata: { contractId: "component.MapConfig" },
  }),
  Position: overridableComponent(
    defineCoordComponent(world, {
      id: "Position",
      metadata: {
        contractId: "component.Position",
      },
    })
  ),
};

export const clientComponents = {};
