import { world } from "./world";
import {
  defineStringComponent,
  defineCoordComponent,
} from "@latticexyz/std-client";

export const contractComponents = {
  CastleOwnable: defineStringComponent(world, {
    id: "CastleOwnable",
    metadata: { contractId: "component.CastleOwnable" },
  }),
  MapConfig: defineStringComponent(world, {
    id: "MapConfig",
    metadata: { contractId: "component.MapConfig" },
  }),
  Position: defineCoordComponent(world, {
    id: "Position",
    metadata: {
      contractId: "component.Position",
    },
  }),
};

export const clientComponents = {};
